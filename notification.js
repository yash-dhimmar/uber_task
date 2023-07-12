var FCM = require('fcm-node');
var serverKey = 'AAAAQb2pM3w:APA91bEyALDZZ-XHMi3hz1ijRnrH0GC7i1UNzQijOpC5n3uw9t_-9Catvuomymn5t4aSCOECYIRQnINEJHjKF8akuJbscjTncoRc-V_nA9xzYY-GNe1D4ufoeO7AQav2QhCZIfOBk8rQ';
var fcm = new FCM(serverKey);

var message = {
  to: 'eKF9luQnRTS394cM0dd43E:APA91bGOQ6py9Q50W9a_3e2L_ZHLSxds6CwYWFLabNrAfVAUFN155nSqx2LSuD4alBfq8ZxK_UVHaJWf9XPF0X380P-D7uohojBvI6EcG4N_F9sFdMfHQQrY2c-DyTGxc-QLurP1rmaO',
  notification: {
    title: 'NotifcatioTestAPP',
    body: '{"Message from node js app"}',
  },
  data: { //you can send only notification or only data(or include both)
    title: 'ok cdfsdsdfsd',
    body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
  }
};
fcm.send(message, function (err, response) {
  if (err) {
    console.log("Something has gone wrong!" + err);
    console.log("Respponse:! " + response);
  } else {
    // showToast("Successfully sent with response");
    console.log("Successfully sent with response: ", response);
  }
});



// trip_id: {
//   allowNull: false,
//   autoIncrement: true,
//   primaryKey: true,
//   type: Sequelize.INTEGER
// },
// tripDate: {
//   type: DataTypes.DATE,
//   allowNull: false
// },
// driver_id: {
//   type: DataTypes.INTEGER,
//   references: {
//     model: {
//       tableName: 'Users',
//     },
//     key: 'user_id',
//   },
// },
// user_id: {
//   type: DataTypes.INTEGER,
//   references: {
//     model: {
//       tableName: 'Users',
//     },
//     key: 'user_id',
//   },
// },
// tripStatus: {
//   type: Sequelize.ENUM('Customer Requested', 'Driver Rejected', 'Driver Accepted', 'Trip Started', 'Trip Completed'),
//   defaultValue: 'Customer Requested'
// },
// pickuplocation_id: {
//   type: Sequelize.INTEGER,
//   references: {
//     model: {
//       tableName: 'pickuplocations',
//     },
//     key: 'pickuplocation_id',
//   },
// },
// pickupdistance: {
//   type: Sequelize.DOUBLE
// },
// estimatepickuptime: {
//   type: Sequelize.DOUBLE
// },
// droplocation_id: {
//   type: Sequelize.INTEGER,
//   references: {
//     model: {
//       tableName: 'droplocations',
//     },
//     key: 'droplocation_id',
//   },
// },
// estimatedroplocationtime: {
//   type: Sequelize.DOUBLE
// },
// tripfare: {
//   type: Sequelize.DOUBLE
// },
// farecollected: {
//   type: Sequelize.BOOLEAN
// },
// start_time: {
//   type: Sequelize.TIME
// },
// end_time: {
//   type: Sequelize.TIME
// },
// createdAt: {
//   allowNull: false,
//   type: Sequelize.DATE
// },
// updatedAt: {
//   allowNull: false,
//   type: Sequelize.DATE
// }





