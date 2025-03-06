"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Star } from "lucide-react"

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("")

  // Inline styles
  const styles = {
    homepage: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    heroSection: {
      background: "linear-gradient(to right, #5a4a9f, #7a6abf)",
      color: "white",
    },
    heroContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    heroText: {
      width: "100%",
      maxWidth: "700px",
      padding: "4rem 0",
      textAlign: "center",
    },
    heroTitle: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      lineHeight: 1.2,
    },
    heroSubtitle: {
      fontSize: "1.125rem",
      marginBottom: "2rem",
    },
    searchContainer: {
      position: "relative",
      maxWidth: "500px",
      margin: "0 auto",
    },
    searchInput: {
      width: "100%",
      padding: "0.75rem 1rem",
      paddingRight: "3rem",
      borderRadius: "0.375rem",
      border: "none",
      fontSize: "1rem",
      outline: "none",
    },
    searchButton: {
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      backgroundColor: "#ff5757",
      color: "white",
      padding: "0 1rem",
      border: "none",
      borderTopRightRadius: "0.375rem",
      borderBottomRightRadius: "0.375rem",
      cursor: "pointer",
    },
    searchIcon: {
      width: "1.25rem",
      height: "1.25rem",
    },
    coursesSection: {
      padding: "4rem 0",
    },
    sectionHeader: {
      textAlign: "center",
      marginBottom: "3rem",
    },
    sectionTitle: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    sectionSubtitle: {
      color: "#6b7280",
    },
    courseCarousel: {
      position: "relative",
    },
    carouselArrow: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "white",
      border: "none",
      borderRadius: "50%",
      width: "2.5rem",
      height: "2.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
      zIndex: 10,
    },
    carouselArrowLeft: {
      left: 0,
    },
    carouselArrowRight: {
      right: 0,
    },
    carouselArrowIcon: {
      width: "1.5rem",
      height: "1.5rem",
      color: "#4b5563",
    },
    courseList: {
      display: "flex",
      gap: "1.5rem",
      overflowX: "auto",
      padding: "0 2rem 1rem 2rem",
      scrollBehavior: "smooth",
    },
    courseCard: {
      flex: "0 0 auto",
      width: "16rem",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    },
    courseImageContainer: {
      position: "relative",
    },
    courseImage: {
      width: "100%",
      height: "10rem",
      objectFit: "cover",
    },
    coursePrice: {
      position: "absolute",
      top: "0.5rem",
      right: "0.5rem",
      backgroundColor: "#ff5757",
      color: "white",
      fontSize: "0.875rem",
      fontWeight: "bold",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
    },
    courseDetails: {
      padding: "1rem",
    },
    courseTitle: {
      fontWeight: "bold",
      marginBottom: "0.25rem",
    },
    courseInstructor: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginBottom: "0.5rem",
    },
    courseRating: {
      display: "flex",
      alignItems: "center",
    },
    ratingStars: {
      display: "flex",
      color: "#fbbf24",
    },
    starIcon: {
      width: "1rem",
      height: "1rem",
      fill: "currentColor",
    },
    ratingValue: {
      fontSize: "0.875rem",
      marginLeft: "0.25rem",
    },
    ratingCount: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginLeft: "0.25rem",
    },
  }

  const courses = [
    {
      id: 1,
      title: "Python for Data Science and Machine Learning",
      instructor: "Mario Speedwagon",
      price: 118,
      rating: 4.9,
      reviews: 120,
    },
    {
      id: 2,
      title: "Python for Data Science and Machine Learning",
      instructor: "Mario Speedwagon",
      price: 118,
      rating: 4.9,
      reviews: 120,
    },
    {
      id: 3,
      title: "Python for Data Science and Machine Learning",
      instructor: "Mario Speedwagon",
      price: 4.9,
      rating: 4.9,
      reviews: 120,
    },
    {
      id: 4,
      title: "Python for Data Science and Machine Learning",
      instructor: "Mario Speedwagon",
      price: 118,
      rating: 4.9,
      reviews: 120,
    },
  ]

  return (
    <div style={styles.homepage}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.container}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <h1 style={styles.heroTitle}>Learn new skills online with top educators</h1>
              <p style={styles.heroSubtitle}>Learn 100% online with world-class universities and industry experts.</p>

              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                <button style={styles.searchButton}>
                  <Search style={styles.searchIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section style={styles.coursesSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>The world's largest selection of courses</h2>
            <p style={styles.sectionSubtitle}>
              Choose from 130,000 online video courses with new additions published every month
            </p>
          </div>

          <div style={styles.courseCarousel}>
            <button style={{ ...styles.carouselArrow, ...styles.carouselArrowLeft }}>
              <ChevronLeft style={styles.carouselArrowIcon} />
            </button>

            <div style={styles.courseList}>
              {courses.map((course) => (
                <div key={course.id} style={styles.courseCard}>
                  <div style={styles.courseImageContainer}>
                    <div style={styles.coursePrice}>${course.price}</div>
                  </div>

                  <div style={styles.courseDetails}>
                    <h3 style={styles.courseTitle}>{course.title}</h3>
                    <p style={styles.courseInstructor}>by {course.instructor}</p>

                    <div style={styles.courseRating}>
                      <div style={styles.ratingStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} style={styles.starIcon} />
                        ))}
                      </div>
                      <span style={styles.ratingValue}>{course.rating}</span>
                      <span style={styles.ratingCount}>({course.reviews} Reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button style={{ ...styles.carouselArrow, ...styles.carouselArrowRight }}>
              <ChevronRight style={styles.carouselArrowIcon} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage

