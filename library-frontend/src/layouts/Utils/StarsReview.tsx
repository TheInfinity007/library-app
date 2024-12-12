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

    if (rating > 0 && rating <= 5) {
        for (let i = 0; i < 5; i++) {
            if (rating - 1 >= 0) {
                fullStars += 1;
                rating -= 1;
            } else if (rating === 0.5) {
                halfStars += 1;
                rating -= 0.5;
            } else if (rating === 0) {
                emptyStars++;
            } else {
                break;
            }
        }
    } else {
        emptyStars = 5;
    }

    return (
        <div>
            {Array.from({ length: fullStars }, (_, i) => (
                <StarFilled size={size} key={i} />
            ))}

            {Array.from({ length: halfStars }, (_, i) => (
                <StarHalfFilled size={size} key={i} />
            ))}

            {Array.from({ length: emptyStars }, (_, i) => (
                <StarEmpty size={size} key={i} />
            ))}
        </div>
    );
};
