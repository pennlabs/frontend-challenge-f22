// @ts-nocheck
// my d3 code is not typed properly, so we have to disable type checking for this file :/
import * as d3 from "d3";
import { D3DragEvent, Simulation } from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import courseData from "../data/courses.json";
import { SidebarCourseContext } from "../utils";


type DegreeMap = { [key: number]: number };
type Course = { id: number, label: string };
type Prerequisite = { source: number, target: number };

// In D3 force simulations, the links (usually represented as lines) and nodes (usually circles or other SVG shapes)
// get augmented with additional properties related to their position (x, y) and velocity (vx, vy)
interface SimulatedNode extends Course {
    x: number;
    y: number;
    vx: number;
    vy: number;
    fx?: number | null;  // Optional fixed x-coordinate
    fy?: number | null;  // Optional fixed y-coordinate
}

interface SimulatedLink { // this is the edge between two nodes. It"s a simulated prerequisite.
    source: SimulatedNode;
    target: SimulatedNode;
}


function CourseGraph({ courses, prerequisites }: { courses: Course[], prerequisites: Prerequisite[] }) {
    const svgRef = useRef(null);
    const [width, setWidth] = useState<number>(600);
    const [height, setHeight] = useState<number>(400);
    const { setSidebarCourse } = useContext(SidebarCourseContext);

    // Calculate the out-degree for each course
    // (the number of courses that depend on it)
    // this is used to determine the size of the node
    const degreeMap = prerequisites.reduce((acc: DegreeMap, link) => {
        acc[link.source] = (acc[link.source] || 0) + 1;
        return acc;
    }, {});

    function handleClick(course: Course) {
        // I want to display a screen on the right that contains course information and allows you to add it to cart and etc.
        // It should contain the course number, title, description, prereqs, and coreqs. It should also have a button to add it to cart.

        setSidebarCourse(courseData.find(c => c.number === course.id));
    }

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear the SVG for re-render

        const width = document.body.getBoundingClientRect().width || 600;
        const height = document.body.getBoundingClientRect().height - 88 || 400;
        setWidth(width);
        setHeight(height);

        const simulation = d3.forceSimulation(courses)
            .force("link", d3.forceLink(prerequisites).id((d: Course) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-800)) // force that pushes nodes apart
            .force("center", d3.forceCenter(width / 2, height / 2)) // default is 0.1
            .force("collide", d3.forceCollide().radius(20)) // to prevent nodes from overlapping

        // Add one line for each prerequisite
        const link = svg.append("g")
            .attr("stroke", "#e7e5e4") // tailwind stone 200
            .selectAll("line")
            .data(prerequisites)
            .join("line")

        // Filter for the nodes' outside glow
        const filter = svg.append("defs").append("filter")
            .attr("id", "glow");
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "2.5")
            .attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Add one node for each course
        const node = svg.append("g")
            .selectAll("circle")
            .data(courses)
            .join("circle")
            .attr("r", (d: Course) => 20 + (degreeMap[d.id] || 0) * 10)  // Adjust node size based on out-degree. Base size is 20, and grows by 10 units for each additional degree.
            .attr("fill", "#011F5B") // UPenn blue
            .style("filter", "url(#glow)")
            .call(drag(simulation));

        // Adding labels
        const labels = svg.append("g")
            .selectAll("text")
            .data(courses)
            .join("text")
            .attr("text-anchor", "middle")
            .attr("dy", (d: Course) => 40 + (degreeMap[d.id] || 0) * 10) // shift text down
            .attr("font-size", "0.8em")
            .attr("fill", "#a8a29e") // tailwind stone 400
            .text((d: Course) => d.label);

        // Add mouseover, mouseout, and click events
        node.on("mouseover", function (d: SimulatedNode) {
            d3.select(this) // 'this' refers to the current node being hovered
                .style("stroke-width", "5px") // Increase stroke width for glow effect
                .style("cursor", "pointer"); // Change the cursor to a pointer
        })
            .on("mouseout", function (d) {
                d3.select(this) // 'this' refers to the current node
                    .style("stroke-width", "1px"); // Reset stroke width
            })
            .on("click", function (event: MouseEvent, course: SimulatedNode) {
                handleClick(course)
            });

        // Natural simulation of node movement
        simulation.on("tick", () => {
            link
                .attr("x1", (d: SimulatedLink) => d.source.x)
                .attr("y1", (d: SimulatedLink) => d.source.y)
                .attr("x2", (d: SimulatedLink) => d.target.x)
                .attr("y2", (d: SimulatedLink) => d.target.y);

            node
                .attr("cx", (d: SimulatedNode) => d.x)
                .attr("cy", (d: SimulatedNode) => d.y);

            labels
                .attr("x", (d: SimulatedNode) => d.x)
                .attr("y", (d: SimulatedNode) => d.y);
        });

        // Handle dragging nodes
        function drag(simulation: Simulation<SimulatedNode, SimulatedLink>) {
            function dragstarted(event: D3DragEvent<SimulatedNode, SimulatedNode, SimulatedNode>, d: SimulatedNode) {
                if (!event.active) simulation.alphaTarget(0.3).restart();

                // fx and fy are optional properties in d3 force simulations. they "fix" a node"s position on the x and y axes respectively.
                // this overrides forces that might push or pull it elsewhere.
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event: D3DragEvent<SimulatedNode, SimulatedNode, SimulatedNode>, d: SimulatedNode) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event: D3DragEvent<SimulatedNode, SimulatedNode, SimulatedNode>, d: SimulatedNode) {
                if (!event.active) simulation.alphaTarget(0);

                // unset the fixed x and y coordinates
                // allows the node to be pushed or pulled by the simulation
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

    }, [courses, prerequisites]);

    return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default CourseGraph;
