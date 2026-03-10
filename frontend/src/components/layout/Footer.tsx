import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Task Manager App. All rights reserved.</p>
    </footer>
  );
}