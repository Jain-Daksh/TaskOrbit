import './Footer.css';

export default function Footer() {
  return (
    <footer className='footer'>
      <p>
        &copy; {new Date().getFullYear()} Task Orbit App. All rights reserved.
      </p>
    </footer>
  );
}
