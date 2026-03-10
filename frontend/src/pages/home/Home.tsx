import { Button, Card, Row, Col } from 'antd';
import './Home.css';

export default function Home() {
  return (
    <div className='home-container'>
      <section className='hero'>
        <div className='hero-text'>
          <h1>Organize your team’s work, effortlessly.</h1>
          <p>
            All your projects, tasks, and team collaboration in one place.
            Modern, minimal, and intuitive.
          </p>
          <div className='hero-buttons'>
            <Button type='primary' size='large'>
              Register
            </Button>
            <Button size='large'>Login</Button>
          </div>
        </div>
        <div className='hero-image'>
          <img
            src='https://via.placeholder.com/500x350'
            alt='Task Manager Preview'
          />
        </div>
      </section>

      <section className='features'>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className='feature-card'>
              <h3>Workspaces</h3>
              <p>Create separate workspaces for each team or project.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className='feature-card'>
              <h3>Projects</h3>
              <p>Organize tasks under projects to keep things on track.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className='feature-card'>
              <h3>Tasks</h3>
              <p>Track every task with status, assignee, and deadlines.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable className='feature-card'>
              <h3>Teams</h3>
              <p>Manage your team members and collaborate efficiently.</p>
            </Card>
          </Col>
        </Row>
      </section>

      <footer className='home-footer'>
        <p>
          &copy; {new Date().getFullYear()} Task Manager App. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
