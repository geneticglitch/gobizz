"use client";

import React, { useEffect, useState } from "react";
import { get_non_null_businesses } from "./server_actions";
import { Card } from "flowbite-react";

const ExplorePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await get_non_null_businesses();
        setBusinesses(data.businesses!);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 text-white">Explore</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="max-w-sm hover:shadow-lg transition-shadow duration-300"
              imgAlt={`Image for ${business.name}`}
              imgSrc={business.image_url || "/images/default.jpeg"}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {business.business_name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {business.business_description || "No description available"}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {business.business_address || "No address available"}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {business.business_phonenumber || "No phone number available"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;