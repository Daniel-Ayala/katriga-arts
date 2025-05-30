export interface Author {
  name: string;
  image: string;
  bio: string;
  social: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogItem {
  id: number;
  title: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  imageCaption?: string;
  description: string;
  slug: string;
  content?: string;
  metaDescription?: string;
  author?: Author;
  relatedPosts?: {
    id: number;
    title: string;
    slug: string;
    imageSrc: string;
  }[];
}

export const blogItems: BlogItem[] = [
  {
    id: 1,
    title: 'Mastering Composition in Photography',
    date: 'April 10, 2025',
    imageSrc: '/img/blog1.jpg',
    imageAlt: 'Photographer using rule of thirds grid on camera display',
    imageCaption: 'Applying the rule of thirds in landscape photography',
    description: 'Learn the rule of thirds, leading lines, and framing techniques to create visually compelling photographs that tell a story.',
    metaDescription: 'Essential composition techniques including rule of thirds, leading lines, and framing to improve your photography skills.',
    slug: 'mastering-composition',
    content: `
      <h2>The Foundation of Great Photography</h2>
      <p>Composition is the backbone of compelling images. It's how you arrange elements within your frame to create visual harmony and tell a story.</p>
      
      <h3>Why Composition Matters</h3>
      <p>A well-composed photograph guides the viewer's eye and creates emotional impact. It transforms ordinary scenes into extraordinary images.</p>
      
      <h2>Essential Composition Techniques</h2>
      
      <h3>1. Rule of Thirds</h3>
      <p>Divide your frame into nine equal parts using two horizontal and two vertical lines. Place key elements along these lines or at their intersections.</p>
      <ul>
        <li>Position horizons on the top or bottom line</li>
        <li>Place eyes at intersection points for portraits</li>
        <li>Align vertical subjects with the grid lines</li>
      </ul>
      
      <h3>2. Leading Lines</h3>
      <p>Use natural or man-made lines to guide the viewer's eye through your image:</p>
      <ul>
        <li>Roads, rivers, or fences in landscapes</li>
        <li>Architectural lines in urban photography</li>
        <li>Arms or legs in portrait photography</li>
      </ul>
      
      <blockquote>"Composition is the strongest way of seeing." — Edward Weston</blockquote>
      
      <h3>3. Framing</h3>
      <p>Use elements within your scene to create natural frames around your subject:</p>
      <ul>
        <li>Windows or doorways</li>
        <li>Tree branches</li>
        <li>Architectural elements</li>
      </ul>
      
      <h2>Advanced Composition Concepts</h2>
      
      <h3>Negative Space</h3>
      <p>Empty space around your subject can create powerful minimalist compositions.</p>
      
      <h3>Symmetry and Patterns</h3>
      <p>Perfect for architectural and abstract photography, creating visually satisfying images.</p>
      
      <h2>Putting It All Together</h2>
      <p>While these rules provide guidance, remember they can be broken creatively. The best photographers know the rules so well they can bend them effectively.</p>
    `,
    author: {
      name: 'Valentino Pamera',
      image: '/img/male1.jpg',
      bio: 'Professional photographer with 10+ years experience specializing in landscape and street photography.',
      social: {
        instagram: 'https://instagram.com/valentinopamera',
        twitter: 'https://twitter.com/valentinopamera',
        linkedin: 'https://linkedin.com/in/valentinopamera'
      }
    },
    relatedPosts: [
      { id: 2, title: 'The Art of Lighting in Portrait Photography', slug: 'art-of-lighting', imageSrc: '/img/blog2.jpg' },
      { id: 4, title: 'Shooting in Low Light: Tips and Techniques', slug: 'low-light-photography', imageSrc: '/img/blog4.jpg' },
      { id: 6, title: 'Choosing the Right Camera Gear for Beginners', slug: 'camera-gear-guide', imageSrc: '/img/blog6.jpg' }
    ]
  },
  {
    id: 2,
    title: 'The Art of Lighting in Portrait Photography',
    date: 'March 15, 2025',
    imageSrc: '/img/blog2.jpg',
    imageAlt: 'Portrait with dramatic lighting',
    description: 'Discover how to use natural and artificial lighting to enhance mood and highlight your subjects best features.',
    metaDescription: 'Learn professional lighting techniques for portrait photography using both natural and studio lighting setups.',
    slug: 'art-of-lighting',
    content: `
      <h2>The Foundation of Great Photography</h2>
      <p>Composition is the backbone of compelling images. It's how you arrange elements within your frame to create visual harmony and tell a story.</p>
      
      <h3>Why Composition Matters</h3>
      <p>A well-composed photograph guides the viewer's eye and creates emotional impact. It transforms ordinary scenes into extraordinary images.</p>
      
      <h2>Essential Composition Techniques</h2>
      
      <h3>1. Rule of Thirds</h3>
      <p>Divide your frame into nine equal parts using two horizontal and two vertical lines. Place key elements along these lines or at their intersections.</p>
      <ul>
        <li>Position horizons on the top or bottom line</li>
        <li>Place eyes at intersection points for portraits</li>
        <li>Align vertical subjects with the grid lines</li>
      </ul>
      
      <h3>2. Leading Lines</h3>
      <p>Use natural or man-made lines to guide the viewer's eye through your image:</p>
      <ul>
        <li>Roads, rivers, or fences in landscapes</li>
        <li>Architectural lines in urban photography</li>
        <li>Arms or legs in portrait photography</li>
      </ul>
      
      <blockquote>"Composition is the strongest way of seeing." — Edward Weston</blockquote>
      
      <h3>3. Framing</h3>
      <p>Use elements within your scene to create natural frames around your subject:</p>
      <ul>
        <li>Windows or doorways</li>
        <li>Tree branches</li>
        <li>Architectural elements</li>
      </ul>
      
      <h2>Advanced Composition Concepts</h2>
      
      <h3>Negative Space</h3>
      <p>Empty space around your subject can create powerful minimalist compositions.</p>
      
      <h3>Symmetry and Patterns</h3>
      <p>Perfect for architectural and abstract photography, creating visually satisfying images.</p>
      
      <h2>Putting It All Together</h2>
      <p>While these rules provide guidance, remember they can be broken creatively. The best photographers know the rules so well they can bend them effectively.</p>
    `,
    author: {
      name: 'Sophia Chen',
      image: '/img/female1.jpg',
      bio: 'Portrait photographer and lighting specialist working with major fashion magazines.',
      social: {
        instagram: 'https://instagram.com/sophiachenphoto',
        website: 'https://sophiachenphotography.com'
      }
    },
    relatedPosts: [
      { id: 1, title: 'Mastering Composition in Photography', slug: 'mastering-composition', imageSrc: '/img/blog1.jpg' },
      { id: 3, title: 'Post-Processing Tips for Stunning Images', slug: 'post-processing-tips', imageSrc: '/img/blog3.jpg' }
    ]
  },
  {
    id: 3,
    title: 'Post-Processing Tips for Stunning Images',
    date: 'February 20, 2025',
    imageSrc: '/img/blog3.jpg',
    imageAlt: 'Before and after photo editing comparison',
    description: 'Master Adobe Lightroom and Photoshop techniques to enhance colors, sharpness, and overall impact of your photos.',
    metaDescription: 'Professional photo editing workflow using Lightroom and Photoshop to transform your images.',
    slug: 'post-processing-tips',
    content: `
      <h2>The Foundation of Great Photography</h2>
      <p>Composition is the backbone of compelling images. It's how you arrange elements within your frame to create visual harmony and tell a story.</p>
      
      <h3>Why Composition Matters</h3>
      <p>A well-composed photograph guides the viewer's eye and creates emotional impact. It transforms ordinary scenes into extraordinary images.</p>
      
      <h2>Essential Composition Techniques</h2>
      
      <h3>1. Rule of Thirds</h3>
      <p>Divide your frame into nine equal parts using two horizontal and two vertical lines. Place key elements along these lines or at their intersections.</p>
      <ul>
        <li>Position horizons on the top or bottom line</li>
        <li>Place eyes at intersection points for portraits</li>
        <li>Align vertical subjects with the grid lines</li>
      </ul>
      
      <h3>2. Leading Lines</h3>
      <p>Use natural or man-made lines to guide the viewer's eye through your image:</p>
      <ul>
        <li>Roads, rivers, or fences in landscapes</li>
        <li>Architectural lines in urban photography</li>
        <li>Arms or legs in portrait photography</li>
      </ul>
      
      <blockquote>"Composition is the strongest way of seeing." — Edward Weston</blockquote>
      
      <h3>3. Framing</h3>
      <p>Use elements within your scene to create natural frames around your subject:</p>
      <ul>
        <li>Windows or doorways</li>
        <li>Tree branches</li>
        <li>Architectural elements</li>
      </ul>
      
      <h2>Advanced Composition Concepts</h2>
      
      <h3>Negative Space</h3>
      <p>Empty space around your subject can create powerful minimalist compositions.</p>
      
      <h3>Symmetry and Patterns</h3>
      <p>Perfect for architectural and abstract photography, creating visually satisfying images.</p>
      
      <h2>Putting It All Together</h2>
      <p>While these rules provide guidance, remember they can be broken creatively. The best photographers know the rules so well they can bend them effectively.</p>
    `,
    author: {
      name: 'David Kim',
      image: '/img/male2.jpg',
      bio: 'Photo editing expert and Adobe Certified Instructor with 8 years of teaching experience.',
      social: {
        twitter: 'https://twitter.com/davidkimedits',
        linkedin: 'https://linkedin.com/in/davidkimedits'
      }
    },
    relatedPosts: [
      { id: 2, title: 'The Art of Lighting in Portrait Photography', slug: 'art-of-lighting', imageSrc: '/img/blog2.jpg' },
      { id: 5, title: 'Trends in Drone Photography for 2025', slug: 'drone-photography-trends', imageSrc: '/img/blog5.jpg' }
    ]
  },
  {
    id: 4,
    title: 'Shooting in Low Light: Tips and Techniques',
    date: 'January 25, 2025',
    imageSrc: '/img/blog4.jpg',
    imageAlt: 'Cityscape at night with long exposure',
    imageCaption: '30-second exposure of downtown skyline at night',
    description: 'Explore strategies for capturing sharp, vibrant images in challenging low-light conditions, from nightscapes to indoor events.',
    metaDescription: 'Complete guide to low-light photography including camera settings, gear recommendations, and shooting techniques.',
    slug: 'low-light-photography',
    content: `
      <h2>The Foundation of Great Photography</h2>
      <p>Composition is the backbone of compelling images. It's how you arrange elements within your frame to create visual harmony and tell a story.</p>
      
      <h3>Why Composition Matters</h3>
      <p>A well-composed photograph guides the viewer's eye and creates emotional impact. It transforms ordinary scenes into extraordinary images.</p>
      
      <h2>Essential Composition Techniques</h2>
      
      <h3>1. Rule of Thirds</h3>
      <p>Divide your frame into nine equal parts using two horizontal and two vertical lines. Place key elements along these lines or at their intersections.</p>
      <ul>
        <li>Position horizons on the top or bottom line</li>
        <li>Place eyes at intersection points for portraits</li>
        <li>Align vertical subjects with the grid lines</li>
      </ul>
      
      <h3>2. Leading Lines</h3>
      <p>Use natural or man-made lines to guide the viewer's eye through your image:</p>
      <ul>
        <li>Roads, rivers, or fences in landscapes</li>
        <li>Architectural lines in urban photography</li>
        <li>Arms or legs in portrait photography</li>
      </ul>
      
      <blockquote>"Composition is the strongest way of seeing." — Edward Weston</blockquote>
      
      <h3>3. Framing</h3>
      <p>Use elements within your scene to create natural frames around your subject:</p>
      <ul>
        <li>Windows or doorways</li>
        <li>Tree branches</li>
        <li>Architectural elements</li>
      </ul>
      
      <h2>Advanced Composition Concepts</h2>
      
      <h3>Negative Space</h3>
      <p>Empty space around your subject can create powerful minimalist compositions.</p>
      
      <h3>Symmetry and Patterns</h3>
      <p>Perfect for architectural and abstract photography, creating visually satisfying images.</p>
      
      <h2>Putting It All Together</h2>
      <p>While these rules provide guidance, remember they can be broken creatively. The best photographers know the rules so well they can bend them effectively.</p>
    `,
    author: {
      name: 'Enny Wong',
      image: '/img/female3.jpg',
      bio: 'Night photography specialist and workshop leader, known for his urban nightscapes.',
      social: {
        instagram: 'https://instagram.com/marcusnightshots',
        website: 'https://marcuswongphotography.com'
      }
    },
    relatedPosts: [
      { id: 1, title: 'Mastering Composition in Photography', slug: 'mastering-composition', imageSrc: '/img/blog1.jpg' },
      { id: 3, title: 'Post-Processing Tips for Stunning Images', slug: 'post-processing-tips', imageSrc: '/img/blog3.jpg' },
      { id: 5, title: 'Trends in Drone Photography for 2025', slug: 'drone-photography-trends', imageSrc: '/img/blog5.jpg' }
    ]
  },
  {
    id: 5,
    title: 'Trends in Drone Photography for 2025',
    date: 'December 12, 2024',
    imageSrc: '/img/blog5.jpg',
    imageAlt: 'Aerial drone shot of coastline',
    description: 'Stay ahead with the latest drone photography trends, including aerial storytelling and advanced camera technology.',
    metaDescription: 'Emerging trends in drone photography for 2025, from new camera tech to creative aerial techniques.',
    slug: 'drone-photography-trends',
    content: `
      <h2>The Foundation of Great Photography</h2>
      <p>Composition is the backbone of compelling images. It's how you arrange elements within your frame to create visual harmony and tell a story.</p>
      
      <h3>Why Composition Matters</h3>
      <p>A well-composed photograph guides the viewer's eye and creates emotional impact. It transforms ordinary scenes into extraordinary images.</p>
      
      <h2>Essential Composition Techniques</h2>
      
      <h3>1. Rule of Thirds</h3>
      <p>Divide your frame into nine equal parts using two horizontal and two vertical lines. Place key elements along these lines or at their intersections.</p>
      <ul>
        <li>Position horizons on the top or bottom line</li>
        <li>Place eyes at intersection points for portraits</li>
        <li>Align vertical subjects with the grid lines</li>
      </ul>
      
      <h3>2. Leading Lines</h3>
      <p>Use natural or man-made lines to guide the viewer's eye through your image:</p>
      <ul>
        <li>Roads, rivers, or fences in landscapes</li>
        <li>Architectural lines in urban photography</li>
        <li>Arms or legs in portrait photography</li>
      </ul>
      
      <blockquote>"Composition is the strongest way of seeing." — Edward Weston</blockquote>
      
      <h3>3. Framing</h3>
      <p>Use elements within your scene to create natural frames around your subject:</p>
      <ul>
        <li>Windows or doorways</li>
        <li>Tree branches</li>
        <li>Architectural elements</li>
      </ul>
      
      <h2>Advanced Composition Concepts</h2>
      
      <h3>Negative Space</h3>
      <p>Empty space around your subject can create powerful minimalist compositions.</p>
      
      <h3>Symmetry and Patterns</h3>
      <p>Perfect for architectural and abstract photography, creating visually satisfying images.</p>
      
      <h2>Putting It All Together</h2>
      <p>While these rules provide guidance, remember they can be broken creatively. The best photographers know the rules so well they can bend them effectively.</p>
    `,
    author: {
      name: 'Elena Rodriguez',
      image: '/img/female2.jpg',
      bio: 'Award-winning aerial photographer and FAA-certified drone pilot.',
      social: {
        instagram: 'https://instagram.com/',
        website: 'https://youtube.com/'
      }
    },
    relatedPosts: [
      { id: 1, title: 'Mastering Composition in Photography', slug: 'mastering-composition', imageSrc: '/img/blog1.jpg' },
      { id: 4, title: 'Shooting in Low Light: Tips and Techniques', slug: 'low-light-photography', imageSrc: '/img/blog4.jpg' }
    ]
  },
  {
    id: 6,
    title: 'Choosing the Right Camera Gear for Beginners',
    date: 'November 5, 2024',
    imageSrc: '/img/blog6.jpg',
    imageAlt: 'Collection of cameras and lenses on table',
    description: 'A guide to selecting cameras, lenses, and accessories that suit your photography style and budget.',
    metaDescription: 'Beginner-friendly guide to choosing the best camera equipment for different photography styles and budgets.',
    slug: 'camera-gear-guide',
    content: `
      <h2>The Foundation of Great Photography</h2>
      <p>Composition is the backbone of compelling images. It's how you arrange elements within your frame to create visual harmony and tell a story.</p>
      
      <h3>Why Composition Matters</h3>
      <p>A well-composed photograph guides the viewer's eye and creates emotional impact. It transforms ordinary scenes into extraordinary images.</p>
      
      <h2>Essential Composition Techniques</h2>
      
      <h3>1. Rule of Thirds</h3>
      <p>Divide your frame into nine equal parts using two horizontal and two vertical lines. Place key elements along these lines or at their intersections.</p>
      <ul>
        <li>Position horizons on the top or bottom line</li>
        <li>Place eyes at intersection points for portraits</li>
        <li>Align vertical subjects with the grid lines</li>
      </ul>
      
      <h3>2. Leading Lines</h3>
      <p>Use natural or man-made lines to guide the viewer's eye through your image:</p>
      <ul>
        <li>Roads, rivers, or fences in landscapes</li>
        <li>Architectural lines in urban photography</li>
        <li>Arms or legs in portrait photography</li>
      </ul>
      
      <blockquote>"Composition is the strongest way of seeing." — Edward Weston</blockquote>
      
      <h3>3. Framing</h3>
      <p>Use elements within your scene to create natural frames around your subject:</p>
      <ul>
        <li>Windows or doorways</li>
        <li>Tree branches</li>
        <li>Architectural elements</li>
      </ul>
      
      <h2>Advanced Composition Concepts</h2>
      
      <h3>Negative Space</h3>
      <p>Empty space around your subject can create powerful minimalist compositions.</p>
      
      <h3>Symmetry and Patterns</h3>
      <p>Perfect for architectural and abstract photography, creating visually satisfying images.</p>
      
      <h2>Putting It All Together</h2>
      <p>While these rules provide guidance, remember they can be broken creatively. The best photographers know the rules so well they can bend them effectively.</p>
    `,
    author: {
      name: 'James Wina',
      image: '/img/female4.jpg',
      bio: 'Camera gear expert and founder of PhotoGearReviews.com',
      social: {
        twitter: 'https://twitter.com/jameswgear',
        website: 'https://photogearreviews.com'
      }
    },
    relatedPosts: [
      { id: 2, title: 'The Art of Lighting in Portrait Photography', slug: 'art-of-lighting', imageSrc: '/img/blog2.jpg' },
      { id: 3, title: 'Post-Processing Tips for Stunning Images', slug: 'post-processing-tips', imageSrc: '/img/blog3.jpg' }
    ]
  }
];