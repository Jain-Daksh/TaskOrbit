import { Button, Card, Row, Col } from 'antd';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const navigate = useNavigate();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Task Orbit',
    url: 'https://task-orbit-nu.vercel.app/',
    description:
      'Task Orbit is a modern team project and task management application for organizing workspaces, projects, tasks, and teams.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    author: {
      '@type': 'Person',
      name: 'Daksh Jain',
      url: 'https://jain-daksh.vercel.app/',
    },
  };

  return (
    <div className="home-container">
      <Helmet>
        <html lang="en" />

        <title>
          Task Orbit | Team Project & Task Management App
        </title>

        <meta
          name="description"
          content="Task Orbit is a modern team project and task management app for organizing workspaces, projects, tasks, teams, and collaboration in one place."
        />

        <link
          rel="canonical"
          href="https://task-orbit-nu.vercel.app/"
        />

        <meta
          name="robots"
          content="index, follow"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Task Orbit | Team Project & Task Management App"
        />

        <meta
          property="og:description"
          content="Organize your team's work, projects, tasks, and collaboration with Task Orbit."
        />

        <meta
          property="og:url"
          content="https://task-orbit-nu.vercel.app/"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="Task Orbit"
        />

        {/* Twitter / X */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Task Orbit | Team Project & Task Management App"
        />

        <meta
          name="twitter:description"
          content="Organize your team's work, projects, tasks, and collaboration with Task Orbit."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Organize your team’s work, effortlessly.</h1>

          <p>
            All your projects, tasks, and team collaboration in one place.
            Modern, minimal, and intuitive.
          </p>

          <div className="hero-buttons">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>

            <Button
              onClick={() => navigate('/login')}
              size="large"
            >
              Login
            </Button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/Time_management_pana.svg"
            alt="Task Orbit project and task management dashboard"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <h2>Workspaces</h2>
              <p>
                Create separate workspaces for each team or project.
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <h2>Projects</h2>
              <p>
                Organize tasks under projects to keep things on track.
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <h2>Tasks</h2>
              <p>
                Track every task with status, assignee, and deadlines.
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card hoverable className="feature-card">
              <h2>Teams</h2>
              <p>
                Manage your team members and collaborate efficiently.
              </p>
            </Card>
          </Col>
        </Row>
      </section>

      <Footer />
    </div>
  );
}