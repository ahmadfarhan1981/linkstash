"use client";

import { AuthenticatedSection, BookmarksPage, BookmarksPageMultSelectProvider, Intro } from "@/components";


export default function Home() {
    
  return (
    <AuthenticatedSection prefix={<Intro />}>
      <BookmarksPageMultSelectProvider>
        <BookmarksPage />
      </BookmarksPageMultSelectProvider>
    </AuthenticatedSection>
  );
}
