import React from 'react';

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#121212',
    color: '#ffffff', // All text is bright white
  },
  row: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as 'wrap',
  },
  column: {
    flex: '1',
    minWidth: '300px',
  },
  inventoryImg: {
    width: '60%',
    marginBottom: '1rem',
    borderRadius: '8px',
  },
  trackImg: {
    width: '40%',
    marginBottom: '1rem',
    borderRadius: '8px',
  },
  heading: {
    fontSize: '1.75rem',
    color: '#ffffff',
    marginBottom: '1rem',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#ffffff',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
  },
  upcoming: {
    marginTop: '2rem',
  },
};

const AboutPage: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Inventory Management & Track Sections */}
      <div style={styles.row}>
        {/* Inventory Management Column */}
        <div style={styles.column}>
          <img
            src="https://i.postimg.cc/Cxs2KsYk/Screenshot-2025-02-08-at-3-37-12-PM.png"
            alt="Inventory Management"
            style={styles.inventoryImg}
          />
          <h2 style={styles.heading}>
            <strong>Inventory Management</strong>
          </h2>
          <p style={styles.paragraph}>
            <a href="/" style={styles.link}>
              Gobizz
            </a>{' '}
            is a smart inventory management solution designed specifically for the catering world.
            Our solution enables restaurants, caterers, and food service providers to monitor ingredients,
            supplies, and dishes in real time. With an intuitive interface, Gobizz streamlines your operations
            by tracking every item from receipt to usage. This not only minimizes waste and reduces costs but
            also simplifies your ordering and replenishment processes. The system empowers you to maintain
            optimal stock levels and ensures that you always have the right ingredients at the right time,
            transforming inventory management into a strategic advantage.
          </p>
        </div>

        {/* Track Column */}
        <div style={styles.column}>
          <img
            src="https://i.postimg.cc/L5ktVvxV/Screenshot-2025-02-08-at-3-48-24-PM.png"
            alt="Task Tracking"
            style={styles.trackImg}
          />
          <h2 style={styles.heading}>
            <strong>Track</strong>
          </h2>
          <p style={styles.paragraph}>
            At the core of Gobizz’s functionality is a robust tracking system that meticulously monitors every movement
            within your inventory. From the moment ingredients enter your storage to the precise usage in your kitchen,
            our platform logs every transaction in real time. This comprehensive tracking provides you with accurate data
            on stock levels, expiration dates, and usage patterns, helping you make proactive decisions. With detailed analytics
            and timely alerts, our tracking system not only prevents shortages and overstock situations but also supports you in
            optimizing your overall operational efficiency, ensuring that your culinary creations are always backed by precise
            and reliable data.
          </p>
        </div>
      </div>

      {/* Upcoming Features Section */}
      <div style={styles.upcoming}>
        <h3 style={styles.heading}>
          <strong>Upcoming Features</strong>
        </h3>
        <p style={styles.paragraph}>
          We are actively working on an <strong>Order</strong> feature that will let you place orders directly within Gobizz.
          Stay tuned for updates on how this new functionality will further streamline and enhance your catering operations!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;