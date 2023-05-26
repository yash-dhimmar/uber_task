// async checkout(user_id, body) {
//   return new Promise(async (resolve, reject) => {
//     try {

//       var [check] = await db.query(`select * from add_cart where user_id='${user_id}'`)
//       let { address_id, coupan_id } = body

//       var [address] = await db.query(`select address_id from address where user_id='${user_id}' and address_id='${address_id}'`)

//       var cod = "COD"
//       var data = await this.cart(user_id, body)
//       var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

//       if (check.length > 0) {

//         var [insert] = await db.query(`insert into orders(date,user_id,sub_total,deliverycharge,grandtotal,payment_type,address_id,status,coupan_id) values ('${date}','${user_id}','${data.total}','${data.deliverycharge}','${data.grandtotal}','${cod}','${address[0].address_id}','${1}','${coupan_id}')`)

//         if (insert) {
//           var [select] = await db.query(`select * from product inner join add_cart on product.product_id=add_cart.product_id  join orders on add_cart.user_id=orders.user_id where orders.user_id='${user_id}' and add_cart.user_id='${user_id}'`)

//           for (let i = 0; i < select.length; i++) {
//             var orderitem = await db.query(`insert into order_item(product_id,order_id,price,discount_price,quantity)values('${select[i].product_id}','${select[i].order_id}','${select[i].price}','${select[i].discount_price}','${select[i].quantity}')`)
//           }
//         }

//       }
//       var cartlist = {
//         item_total: data,
//         delieverytype: cod
//       }
//       resolve(cartlist)
//     } catch (error) {
//       return reject(error)
//     }
//   })
// }
// async order_list(user_id) {
//   try {
//     return new promise(async (resolve, reject) => {
//       var [data] = await db.query(`select orders.date ,orders.order_id,orders.status,orders.grandtotal as Totalpayment,address.type as Deliveredto from orders inner join address on address.address_id=orders.address_id where orders.user_id='${user_id}'`)
//       resolve(data)

//       return resolve(data);
//     })
//   } catch (error) {
//     return reject(error);
//   }
// }

// async order_details(user_id, body) {
//   try {
//     return new promise(async (resolve, reject) => {

//       let { order_id } = body

//       var [join] = await db.query(`select o.order_id ,o.payment_type as paymenttype ,o.date ,a.home_detail,a.landmark from orders as o inner join address as a on o.address_id=a.address_id 
//       where o.user_id='${user_id}' and o.order_id='${order_id}'`);

//       if (join.length > 0) {

//         var [product] = await db.query(`select p.image,p.productname,p.price,o.quantity from order_item as o inner join product as p on o.product_id=p.product_id where o.order_id='${order_id}'`);

//         join[0].item = product

//         var [totaldata] = await db.query(`select sub_total,deliverycharge,grandtotal from orders where order_id='${order_id}'`)

//         join[0].Billdetails = totaldata[0]
//         resolve(join);
//       } else {
//         var data = {
//           message: "order is not available"
//         }
//         reject(data);
//       }

//     })

//   } catch (error) {
//     return reject(error);
//   }
// }