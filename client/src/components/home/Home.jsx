import React from "react";
import useHomeData from "../../hooks/useHomeData";
import SearchBar from "../../components/SearchBar";
import FeaturedStores from "../../components/FeaturedStores";
import CategoryGrid from "../../components/CategoryGrid";
import RecommendedStores from "../../components/RecommendedStores";

export default function Home() {
    const { data, loading, refresh } = useHomeData();

    if (loading) return <div className="skeleton">Loading...</div>;

    return (
        <div className="home-container" onScroll={(e) => {
            if (e.target.scrollTop === 0) refresh();   // Pull-to-refresh lite
        }}>
            <SearchBar />

            <FeaturedStores list={data.featuredStores} />
            <CategoryGrid list={data.categories} />
            <RecommendedStores list={data.recommendedStores} />
        </div>
    );
}
