import styles from '@/Nav-Contants/styles';
import React from 'react';
import TitleText from './TitleText';
import { exploreWorlds } from '@/Nav-Contants/app_data-links';
import ExploreCard from './ExploreCard';

const Explore = () => {
    return <section className="px-6 py-10">
        <div className={`${styles.innerWidth} mx-auto flex flex-col`}>
            <TitleText title={
                <span className="text-third-color  font-extrabold">
                    Your Comfort Is Our Duty
                </span>
            } />
            <div className="my-9 flex lg:flex-row flex-col min-h-[50vh] gap-8 lg:mx-32">
                {exploreWorlds?.map((world, index) => (
                    <ExploreCard key={index} world={world} />
                ))}
            </div>
        </div>
    </section>


};

export default Explore
