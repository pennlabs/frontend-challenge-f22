import courses from '../data/courses.json'

const Courses = () => (
  <>
    {courses.map(({ dept, number}) => (
      <p key={`${dept}-${number}`}>
        {dept}
        {' '}
        {number}
      </p>
    ))}
  </>
)

export default Courses;