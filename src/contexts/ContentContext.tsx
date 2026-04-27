import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ContentType = {
  hero?: { eyebrow: string; headline: string; sub: string; roleTitle: string; name: string };
  about?: { text: string };
  contact?: { email: string; phone: string; location: string };
  experience?: Array<{ id: number; role: string; company: string; period: string; description: string; technologies: string[] }>;
  projects?: Array<{ id: number; title: string; description: string; image: string; tags: string[]; links: { live: string; github: string } }>;
  [key: string]: any;
};

interface ContentContextType {
  content: ContentType;
  updateContent: (section: string, data: any) => Promise<void>;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ContentType>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = import.meta.env.PROD 
      ? `${import.meta.env.BASE_URL}data.json` 
      : 'http://localhost:3001/api/content';

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        // In prod, the static data.json has {content: {...}, testimonials: [...]}
        // but the local /api/content returns JUST the content object.
        const contentData = import.meta.env.PROD ? data.content : data;
        setContent(contentData || {});
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load content', err);
        setIsLoading(false);
      });
  }, []);

  const updateContent = async (section: string, data: any) => {
    try {
      // For array sections (experience, projects), store the data directly
      const isArraySection = Array.isArray(data);
      const newSectionData = isArraySection ? data : { ...content[section], ...data };
      const updatedContent = { ...content, [section]: newSectionData };
      
      // Optimistic update
      setContent(updatedContent);

      await fetch('http://localhost:3001/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [section]: newSectionData })
      });
    } catch (err) {
      console.error('Failed to save content', err);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
