'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://www.flickr.com/photos/96511847@N04/9203152508/"
      },
      {
        reviewId: 2,
        url: "https://live.staticflickr.com/7808/46592163272_6ac2065fb5_m.jpg"
      },
      {
        reviewId: 3,
        url: "https://live.staticflickr.com/5531/9203979618_acd7d3ac34.jpg"
      },
      {
        reviewId: 4,
        url: "https://live.staticflickr.com/694/21751439724_89aa2b1b98_n.jpg"
      },
      {
        reviewId: 5,
        url: "https://live.staticflickr.com/51/139485524_bba26cb9a4_m.jpg"
      },
      {
        reviewId: 6,
        url: "https://live.staticflickr.com/7453/27378032613_44b866dafe_n.jpg"
      },
      {
        reviewId: 7,
        url: "https://live.staticflickr.com/868/40143267045_78eabb9791_n.jpg"
      },
      {
        reviewId: 8,
        url: "https://live.staticflickr.com/4414/36305041031_1a111f6816_n.jpg"
      },
      {
        reviewId: 9,
        url: "https://live.staticflickr.com/7391/8851709178_06960641cb_n.jpg"
      },
      {
        reviewId: 10,
        url: "https://live.staticflickr.com/3749/9724788419_fa643439bb_w.jpg"
      },
      {
        reviewId: 11,
        url: "https://live.staticflickr.com/4480/37457964781_01962f8bc8_n.jpg"
      },
      {
        reviewId: 12,
        url: "https://www.flickr.com/photos/tutonephotos/31654936217/"
      },
      {
        reviewId: 13,
        url: "https://live.staticflickr.com/65535/52848010004_ee58ef9d39_w.jpg"
      },
      {
        reviewId: 14,
        url: "https://live.staticflickr.com/7199/27189040736_3d9d3ae771_n.jpg"
      },
      {
        reviewId: 15,
        url: "https://live.staticflickr.com/65535/50111417382_e862de3993_m.jpg"
      },
      {
        reviewId: 16,
        url: "https://live.staticflickr.com/2113/2531799818_a57da5aa20_m.jpg"
      },
      {
        reviewId: 17,
        url: "https://live.staticflickr.com/5646/23194093574_fe7b3e552a_n.jpg"
      },
      {
        reviewId: 18,
        url: "https://live.staticflickr.com/608/23172479683_2ede7529e4_n.jpg"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] }
    }, {});
  }
};
