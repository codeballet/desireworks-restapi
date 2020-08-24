import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../../sequelize';

export class FeedItem extends Model {}

FeedItem.init({
    caption: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'FeedItem'
});