import './Footer.css';

export default function Footer() {
  return (
    <footer className='footer'>
      <p>
        &copy; {new Date().getFullYear()} Task Orbit App. All rights reserved.{' '}
        <span>·</span> Built by{' '}
        <a
          href='http://jain-daksh.vercel.app/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Daksh Jain
        </a>{' '}
        <span>·</span>{' '}
        <a
          href='https://github.com/jain-daksh'
          target='_blank'
          rel='noopener noreferrer'
        >
          GitHub
        </a>{' '}
        <span>·</span>{' '}
        <a
          href='https://www.linkedin.com/in/jaindaksh'
          target='_blank'
          rel='noopener noreferrer'
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
