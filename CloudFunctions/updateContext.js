module.exports=  (params) =>{
    var Cloudant = require('cloudant');
      var nodemailer = require('nodemailer');
    require('dotenv').config();

    var cloudant = new Cloudant({ url: process.env.Cloudant_Url, maxAttempt: 5, plugins: [ 'iamauth', { retry: { retryDelayMultiplier: 4, retryErrors: true, retryInitialDelayMsecs:1000, retryStatusCodes: [ 429 ] } } ]});
    var userDB = cloudant.db.use('users_db');
      return new Promise(function(resolve,reject){
        console.log(params);
        var query={
            selector: {
               fbId: {
                  "$eq": params.fbId
               }
            }
          }
            userDB.find(query,(err,body)=>{
                            if(err){
                console.log('err getting cloudant')
                reject ({resData:'error'})
              }
              else{
                if(Object.keys(body.docs).length==0){
                  console.log('no User');
                  resolve({resData:'wrongCredentials'})
                }
                else if(body.docs.length>0){
                    console.log('this is get response')
                    console.log(body.docs[0]);
                    var dataRes=body.docs[0];
                    dataRes.contextId.isAgentOn=true;
                    userDB.insert(dataRes, function(err, body1, header) {
                    if (err) {
                          reject ({resData:err.message});
                        }else{
                            resolve({resData:body1})
                        }

                      });

                }
              }
            })
      })

  };
