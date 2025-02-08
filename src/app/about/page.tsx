import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* Top: Two images side by side */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <img
          src="https://i.postimg.cc/Cxs2KsYk/Screenshot-2025-02-08-at-3-37-12-PM.png"
          alt="Inventory Management"
          style={{ width: '40%' }}
        />
        <img
          src="https://i.postimg.cc/L5ktVvxV/Screenshot-2025-02-08-at-3-48-24-PM.png"
          alt="Task"
          style={{ width: '30%' }}
        />
      </div>

      {/* Side-by-side: Inventory management + Track */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        {/* Inventory management column */}
        <div style={{ flex: 1 }}>
          <h2><strong>Inventory management</strong></h2>
          <p>
            Gobizz is a smart inventory management solution designed specifically for the catering world.
            Our solution enables restaurants, caterers, and food service providers to monitor ingredients, 
            supplies, and dishes in real time. With an intuitive interface, Gobizz streamlines your operations 
            by tracking every item from receipt to usage. This not only minimizes waste and reduces costs but 
            also simplifies your ordering and replenishment processes. The system empowers you to maintain 
            optimal stock levels and ensures that you always have the right ingredients at the right time, 
            transforming inventory management into a strategic advantage.
          </p>
        </div>

        {/* Track column */}
        <div style={{ flex: 1 }}>
          <h2><strong>Track</strong></h2>
          <p>
            At the core of Gobizz’s functionality is a robust tracking system that meticulously monitors 
            every movement within your inventory. From the moment ingredients enter your storage to 
            the precise usage in your kitchen, our platform logs every transaction in real time. 
            This comprehensive tracking provides you with accurate data on stock levels, expiration dates, 
            and usage patterns, helping you make proactive decisions. With detailed analytics and timely alerts, 
            our tracking system not only prevents shortages and overstock situations but also supports you in 
            optimizing your overall operational efficiency, ensuring that your culinary creations are always 
            backed by precise and reliable data.
          </p>
        </div>
      </div>

      {/* Upcoming features (Order) */}
      <div>
        <h3>Upcoming Features</h3>
        <p>
          We are actively working on an <strong>Order</strong> feature that will let you
          place orders directly within Gobizz. Stay tuned for updates on how this new
          functionality will further streamline and enhance your catering operations!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
