# Frontend Challenge Fall '22

Welcome to the Penn Labs Frontend Challenge!

If you have already done this challenge, there's a [section below](https://www.notion.so/Frontend-Challenge-Fall-22-d6c03559ee1d4f1f9f56aa6836b7caba) for you. 

In this challenge, you will be building a product called Penn Course Cart in React! The goal of this challenge is for you to demonstrate:

1. An eye for building intuitive, feature-rich user interfaces
2. Ability to build products with minimal direction
3. Ability to work within a set timeline

More concretely, you will build an interface where users can explore computer science courses added at Penn, can add them to a cart, and checkout.

## Getting Started

1. Copy this [repository](https://github.com/pennlabs/frontend-challenge) to your own GitHub account by clicking the green "use this template" button. You will have to make a Github account if you don't already have one. **Be sure to create a private repository.** **You will be submitting a ZIP file at the end of the technical.**
2. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the repository you just made to your own computer. 

```bash
git clone https://github.com/pennlabs/frontend-challenge-f22.git
```

3. Make sure you have [Node](https://www.seas.upenn.edu/~cis197/development) installed.

4. Navigate to the cloned directory in the command line and run `yarn` or `npm install`

5. Run `yarn start` or `npm start`

**Note:** This project is bootstrapped with [Create React App (CRA)](https://github.com/facebook/create-react-app) using [Typescript](https://www.typescriptlang.org/), so hot-reloading has been configured. This means after you run `yarn start` or `npm start`, the application will be recompiled automatically after a file is edited.

## General Structure

We have provided minimal starter code with the following structure. 

```
public/
  index.html           Root HTML file for each page

src/                   Where the JS logic is
  components/          Contains all React components
    Cart.tsx           Basic component for the course cart
    Courses.tsx        Basic component for rendering courses
    Nav.tsx            Basic component for the navbar
    ...                Feel free to add other components

  data/                Contains data rendered by the components
    courses.json       Contains information on CIS courses at Penn

  App.css              CSS for the app
  App.tsx              Root component for the app
  index.tsx            Renders the React app
  ...
```

## Features

Your application should implement the following features. 

1. **Explore Courses**
    
    If you view `src/components/Courses.js`,  you'll see that it is rendering some of the courses data from `src/data/courses.json` What you need to do is design a more robust way to display this courses information. You should display all information contained in the JSON — though put some thought into how to go about doing this. For example, you might only want to show the description once the user clicks on the course.
    
2. **Search and Filter**
    
    At the minimum, the user should be able to:
    
    - Type into a search bar to find courses by title and description
    - Filter courses based on number
3. **Add courses to your cart**
    - A user should be able to add a subset of these courses to their cart. The user should not be able to add more than 7 courses to their cart.
    - When a user adds a course, this addition should be reflected in:
        - How that cart is rendered
        - How that course is rendered (e.g. there should not still be a button to add that course to the cart, and maybe the text should be grayed out)
4. **Checkout cart**
    - Allow users to "checkout" their current cart, which takes the user to a new page, containing a "receipt" with the courses they checked out with. This should be implemented with routing, eg. with [React Router](https://reactrouter.com/en/main). The new page **must** show a different URL in the address bar and get the courses in the receipt using URL or query parameters.
5. **View cart**
    - The user should be able to click a button to view their cart.
        - If the cart has no items in it, tell the user that their cart is empty.
        - If the cart has courses in it, display the courses and relevant information about them.
6. **Additional features**
    
    If you finish early, feel free to add an additional feature! Here are some ideas.
    - Let users rank courses in order of preference using a drag and drop menu
    - Integrate data from the Penn Courses server
        - Note that we added the line `"proxy": "[https://penncourseplan.com](https://penncourseplan.com/)"` to `package.json`. This proxy will allow you to make requests to the Penn Courses backend without running into CORS issues.
        - The [“Retrieve Course” endpoint](https://penncourseplan.com/api/documentation/#tag/PCx-Course/operation/Retrieve%20Course) should have all the data you need to add information for a specific course, but you are welcome to use any endpoint that doesn’t require authentication.
        - Tip: use semesters from Spring 2022 and earlier - they will have 3-digit course codes that match the `courses.json` data.
        - Example:
    
        ```jsx
        fetch('/api/base/2022A/courses/CIS-120/')
          .then(res => res.json())
          .then(console.log);
        ```
7. **Code quality**
    
    These items are totally optional, but a great opportunity to demonstrate your engineering skills!
    
    - Turn on Typescript’s `strictNullChecks` and `noImplicitAny`
    - Add a [linter](https://eslint.org/)
    - Add unit or integration tests

## Additional Tips

- For styling, use whatever you want:
    - CSS frameworks (Bulma, Bootstrap)
    - CSS files (or SCSS)
    - CSS modules
    - CSS-in-JS
    - `styled-components`
- For state management, you have several options:
    - Vanilla react state, props and [context managers](https://reactjs.org/docs/context.html)
    - [Redux](https://redux.js.org/)
    - [SWR](https://swr.vercel.app/)
- For navigation:
    - React Router

### **Getting help**

If you have any questions about the project or need some help, send an email to contact@pennlabs.org!

### **Repeat applicants**

First off, thanks so much for your continued interest in Labs. We've accomplished a lot in the past year and have plans for more great products and features which need new developers to tackle them—so fingers crossed!

At Labs we don't just build new products, we also maintain legacy code bases and year over year push out new and improved versions. [Penn Course Review](https://penncoursereview.com/) and the [Common Funding Application](https://penncfa.com/) are two great examples.

That said, please note the differences between the current challenge and previous challenge, as we constantly update our challenge between semesters in accordance with the submissions we review and applicants' feedback. In line with this, we want you to take your submission from when you last applied, update your code, and take it to the next level with new features and data. Be deliberate with your implementation decisions, architecture, and documentation such that if someone else opens your code 6 months from now they'll be able to pick up right where you left off. We're excited to see what you come up with.

## Submission

You should have created a private copy of the template repository we gave you. To get a ZIP file that you can submit on the submission form, push all your code to GitHub, click the green "Code" dropdown, and then click "Download ZIP". You can then upload this to our submission form.

Please do NOT zip your code from your local computer, as that will package a large number of unnecessary files from the node_modules folder - if the submission is 1GB, something is wrong!
