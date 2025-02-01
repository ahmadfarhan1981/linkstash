import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Changelog from '../components/Changelog/Changelog';



export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <>
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      
      <main>
      <Changelog />
      </main>
    </Layout>
    <h1 className="text-3xl font-bold underline drop-shadow-sm text-ellipsis first-letter:capitalize">    hello world!  </h1>
    
    </>
    
  );
}
