import { Link } from 'react-router-dom';

const categories = [
  'Business', 'Arts', 'Technology', 'Science', 'Geopolitics',
  'History', 'Health', 'Sports', 'Geography', 'Education', 'Nature', 'Entertainment', 'Animals', 'Religions', "Lifestyles",'Travel','Finance','Gaming','Productivity','Fashion','Wellness','Mindset','Innovation'


];

export default function Category() {
  return (
    <div className="container my-5">
      <h2 className="category-header">Explore Categories</h2>
      <div className="category-wrapper">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/category/${category.toLowerCase()}`}
            className="category-item"
          >
            {category}
          </Link>
        ))}
      </div>

      <style>{`
        /* Container */
        .container.my-5 {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
        }
        
        .category-header {
          text-align: center;
          margin-bottom: 30px;
          font-family: 'Orbitron', sans-serif;
          font-size: 21px;
          letter-spacing: 1px;
          background: -webkit-linear-gradient(45deg, #00d4ff, #9147ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight : bold;
        }
        
        /* Wrapper for category links */
        .category-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }
        
        /* Category Item Styles */
        .category-item {
          padding: 10px 20px;
          background: linear-gradient(45deg, #00d4ff, #9147ff);
          color: #fff;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .category-item:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0,212,255,0.35);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 576px) {
          .category-header {
            font-size: 17px;
          }
          .category-item {
            padding: 8px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
