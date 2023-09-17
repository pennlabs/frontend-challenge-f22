import courses from '../data/courses.json';

const Courses = () => (
  <>
    {courses.map(({ dept, number, description }) => (
      <div key={`${dept}-${number}`} className="mb-8">
        <h2 className="font-bold text-3xl">
          {dept}
          {' '}
          {number}
        </h2>
        <p>
          {description}
        </p>
      </div>
    ))}
  </>
)

export default Courses;