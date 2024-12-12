import React from 'react';
import { StarFilled } from './Subutils/StarFilled';
import { StarHalfFilled } from './Subutils/StarHalfFilled';
import { StarEmpty } from './Subutils/StarEmpty';

export const StarsReview: React.FC<{ rating: number; size: number }> = (
    props
) => {
    let { rating, size } = props;
    let fullStars = 0;
    let halfStars = 0;
    let emptyStars = 0;

    // if(rating)

    return (
        <div>
            <StarFilled size={size} />
            <StarFilled size={size} />
            <StarHalfFilled size={size} />
            <StarEmpty size={size} />
        </div>
    );
};
