import styles from '@/styles/Home.module.css'
import logo from "../assets/images/flow-blog-logo.png";
import Image from 'next/image';
import { Col, Row } from 'react-bootstrap';

export default function Home() {
  return (
    <div className={styles.main}>
      <Row className="align-items-center mb-3 gap-2">
        <Col md="auto" className='px-1'>
          <Image
            src={logo}
            alt="The Flow Blog logo"
            width={100}
            height={100}
            className={styles.headlineLogo}
          />
        </Col>
        <Col md="auto" className='px-1'>
          <h1 className={styles.headlineText}>
            Flow Blog
          </h1>
        </Col>
      </Row>

      <h2>Tutorial project by Coding in Flow</h2>
      <p>This is a <strong>full-stack</strong> blogging website built with <strong>NextJS</strong>, <strong>ExpressJS</strong>, and <strong>TypeScript</strong> 💚</p>
      <p>🌟 Get my <a href='https://codinginflow.com/nextjs'><strong>NextJS course</strong></a> to learn how to build this!</p>
      <br />
      <p className='h5'><strong>👀 Features:</strong></p>
      <ul className='text-start w-80'>
        <li><strong>User accounts & profiles</strong>. Sign up either via email & password or <strong>social providers</strong> (Google/GitHub)</li>
        <li>Users can create and update blog posts via a <strong>markdown editor</strong></li>
        <li><strong>Upload images</strong> & resize them on our own backend server</li>
        <li>A fully-fledged <strong>comment system</strong> with sub-comments and edit/delete functionality</li>
        <li>Pagination with both <strong>page numbers</strong> and <strong>infinite loading</strong></li>
        <li>A fully <strong>mobile-responsive</strong> layout & custom theme based on Bootstrap</li>
        <li>A complete backend server built with <strong>ExpressJS</strong> and <strong>MongoDB</strong></li>
      </ul>
      <br />
      <p className='h5'><strong>💡 Concepts covered:</strong></p>
      <ul className='text-start w-80'>
        <li>Advanced NextJS <strong>server-side rendering strategies</strong> like on-demand revalidation</li>
        <li>Client-side <strong>request caching & revalidation</strong> using <strong>SWR</strong> (NextJS&apos; React-Query alternative)</li>
        <li><strong>Advanced React concepts</strong> like context providers, custom hooks, and effect cleanup</li>
        <li><strong>Form handling</strong> with React-Hook-Form and Yup</li>
        <li><strong>Security best practices</strong> like validation of user input & file uploads, and rate-limiting</li>
        <li><strong>User email verification</strong> and <strong>password reset</strong> without expensive backend services like Firebase</li>
        <li><strong>Redis</strong> as a local session storage for super fast access</li>
        <li><strong>Deploy</strong> everything to a real web hosting and learn how to <strong>protect your server from hackers</strong></li>
        <li>and much <strong>more</strong>...</li>
      </ul>
      <br />
      <p className='w-80'>💻 This course goes beyond normal YouTube tutorials and teaches you how to build <strong>real production websites.</strong></p>
    </div>
  )
}