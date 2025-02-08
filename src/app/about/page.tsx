import React from 'react';
// import './AboutPage.css'; // optional, if you want to keep styles separate

const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* Main heading */}
      <h1 style={{ marginBottom: '1rem' }}>How to use the Gobizz </h1>

      {/* Top section with 3 columns: food images, order list, and map */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        {/* Left column: food images */}
        <div style={{ flex: 1 }}>
          {/* You can replace these with real image URLs or imported images */}
          <img
            src="https://via.placeholder.com/300x200?text=Pizza+Image+1"
            alt="Pizza dish"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <img
            src="https://via.placeholder.com/300x200?text=Pizza+Image+2"
            alt="Another dish"
            style={{ width: '100%' }}
          />
        </div>

        {/* Middle column: order list + button */}
        <div style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
        }}>
          <h2 style={{ marginTop: 0 }}>Your Order</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '1rem' }}>
            <li>1 Avocado Toast</li>
            <li>2 Mango Smoothies</li>
            <li>1 Veggie Burger</li>
          </ul>
          <button
            style={{
              backgroundColor: '#3EBB41',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Place Order
          </button>
        </div>

        {/* Right column: map with ETA */}
        <div style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          position: 'relative'
        }}>
          <img
            src="https://via.placeholder.com/300x200?text=Map+Image"
            alt="Map showing route"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '55%',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
            }}
          >
            <strong>3 min ETA</strong>
          </div>
        </div>
      </div>

      {/* Bottom section with three steps: Browse, Order, Track */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h2>Inventory</h2>
          <p>
            Gobizz has hundreds of restaurants to choose from. When you open the app,
            you can scroll through for inspiration or search for a particular restaurant
            or cuisine. When you find something you like, tap to add it to your order.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Order</h2>
          <p>
            When you’re ready to check out, you’ll see your address, an estimated
            delivery time, and the price including tax and delivery fee. When everything
            looks right, just tap <strong>Place order</strong>—and that’s it!
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Track</h2>
          <p>
            Follow your order in the app. First you’ll see the restaurant accept and 
            start prepping. Then, when the order’s almost ready, a nearby delivery 
            person will head to the restaurant to pick it up. Next, they’ll drive or 
            ride to you. You’ll be able to see their name and photo and track progress 
            on the map.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
