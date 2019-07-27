'use strict';

require('dotenv').config();

const express = require('express'); //app server
const app = express();
const request = require('request'); //request module to make http requests
const bodyParser = require('body-parser'); // parser for post requests
const Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk, using only conversation service
const numeral = require('numeral');
const jwt = require('jsonwebtoken-refresh');
const crypto = require("crypto");
var path = require('path');
//var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http)

//cloud functions
const insightsModule = require('./CloudFunctions/insightsModule');
const FbIdCheck = require('./CloudFunctions/FbIdCheck');
const FbIdAdd = require('./CloudFunctions/FbIdAdd');
const TFARegister = require('./CloudFunctions/TFARegister');
const TFACheck = require('./CloudFunctions/TFACheck');
const getBasicUserData = require('./CloudFunctions/getBasicUserData');
const setBasicUserData = require('./CloudFunctions/setBasicUserData');
//const falseTFA = require('./CloudFunctions/falseTFA');
const TFACancel = require('./CloudFunctions/TFACancel');
const listAllusers = require('./CloudFunctions/listAllusers');
const FbUserCheck = require('./CloudFunctions/fbUserCheck');
const setBasicUserData1 = require('./CloudFunctions/p_setBasicUserData');
const fbUserAdd = require('./CloudFunctions/fbUserAdd');
const updateUserDetails = require('./CloudFunctions/updateUserDetails');
const getBasicUserData1 = require('./CloudFunctions/p_getBasicData');

const deleteAllDocuments = require('./CloudFunctions/deleteAllCollections');
const sendEmail = require('./CloudFunctions/sendEmail')
const updateEmail = require('./CloudFunctions/updateEmail');
const findEmail = require('./CloudFunctions/findEmail');
const updateContext = require('./CloudFunctions/updateContext');
const enableBot = require('./CloudFunctions/enableBot');
var rp = require('request-promise');
// server  express config

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/Login'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept");
	next();
});

app.get('/test', (req, res) => {
    console.log(" This is Sample API");
    res.send("This is Sample API");
})
var insightPrototype = new insightsModule();


function insightUserRequestFunction(basicDetails) {
    console.log(basicDetails);
    var requestMessage = {};
    var conversationId = "12341234";
    if (basicDetails.contextId != undefined) {
        conversationId = basicDetails.contextId.conversation_id;
    }

    // This is clokam account.
    if (basicDetails.fbId == "2383429875047161") {

        console.log("******************* Chanakya Lokam account ***************");
        console.log("basicDetails.resData in mInsights Request", basicDetails.resData);
        requestMessage.message =

            {
                "email": "default-user",
                "user": {
                    id: "clokam@miraclesoft.com",
                    name: "Chankaya Lokam"
                },
                "type": "message",
                "origin": "User",
                "recipient": "Bot",
                "text": basicDetails.text,
                "channel": "FaceBook",
                "timestamp": "2019-04-29T18:12:50.231Z",
                "conversationID": conversationId,
                "id": crypto.randomBytes(8).toString("hex"),
                "intent": basicDetails.intent
            }
        console.log("requestMessage.message", requestMessage.message);
        insightPrototype.logMessage(requestMessage);

    }

    // This is Bhanu account
    else if (basicDetails.fbId == "2271641979621103") {

        console.log("******************* Bhnau Kandregula account ***************");
        console.log("basicDetails.resData in mInsights Request", basicDetails.resData);
        requestMessage.message =

            {
                "email": "default-user",
                "user": {
                    id: "bkandregula1@miraclesoft.com",
                    name: "Bhanu Kandregula"
                },
                "type": "message",
                "origin": "User",
                "recipient": "Bot",
                "text": basicDetails.text,
                "channel": "FaceBook",
                "timestamp": "2019-04-29T18:12:50.231Z",
                "conversationID": conversationId,
                "id": crypto.randomBytes(8).toString("hex"),
                "intent": basicDetails.intent
            }
        console.log("requestMessage.message", requestMessage.message);
        insightPrototype.logMessage(requestMessage);

    }

    // This is Brianna account
    //if(basicDetails.fbId == "2694124463950281"){
    else {
        console.log("******************* Brianna account ***************");
        console.log("basicDetails.resData in mInsights Request", basicDetails.resData);

        requestMessage.message =

            {
                "email": "default-user",
                "user": {
                    id: "brianna@gmail.com",
                    name: "Brianna Klein"
                },
                "type": "message",
                "origin": "User",
                "recipient": "Bot",
                "text": basicDetails.text,
                "channel": "FaceBook",
                "timestamp": "2019-04-29T18:12:50.231Z",
                "conversationID": conversationId,
                "id": crypto.randomBytes(8).toString("hex"),
                "intent": basicDetails.intent
                //  "intent": "intent_Greeting"
            }
        console.log("requestMessage.message", requestMessage.message);
        insightPrototype.logMessage(requestMessage);

    }

}

function insightBotResponseFunction(basicDetails) {
    var conversationId = "12341234";
    if (basicDetails.resData.contextId != undefined) {
        conversationId = basicDetails.resData.contextId.conversation_id;
    }

    console.log("basicDetails.resData in mInsights Response", basicDetails.resData);
    var responseMessage = {}

    // This is Chanakya account
    if (basicDetails.id == "2383429875047161") {
        console.log("******************* Chanakya response account ***************");
        responseMessage =

            {
                "email": "default-user",
                "user": {
                    id: "clokam@miraclesoft.com",
                    name: "Chanakya Lokam"
                },
                "type": "message",
                "origin": "User",
                "recipient": "Bot",
                "text": basicDetails.text,
                "channel": "FaceBook",
                "timestamp": "2019-04-29T18:12:50.231Z",
                "conversationID": conversationId,
                "id": crypto.randomBytes(8).toString("hex")
                //  "intent": "intent_Greeting"
            }
        insightPrototype.logMessage(responseMessage);
    }

    // This is Bhanu account
    else if (basicDetails.fbId == "2271641979621103") {
        console.log("******************* Bhanu kandregula response account ***************");
        responseMessage =

            {
                "email": "default-user",
                "user": {
                    id: "bkandregula1@miraclesoft.com",
                    name: "Bhanu Kandregula"
                },
                "type": "message",
                "origin": "User",
                "recipient": "Bot",
                "text": basicDetails.text,
                "channel": "FaceBook",
                "timestamp": "2019-04-29T18:12:50.231Z",
                "conversationID": conversationId,
                "id": crypto.randomBytes(8).toString("hex")
                //  "intent": "intent_Greeting"
            }
        insightPrototype.logMessage(responseMessage);


    }

    // This is Brianna accoutnt
   // if (basicDetails.fbId == "2694124463950281"){
    else {
        console.log("******************* Brianna  response account ***************");
        responseMessage =

            {
                "email": "default-user",
                "user": {
                    id: "brianna@gmail.com",
                    name: "Brianna Klein"
                },
                "type": "message",
                "origin": "User",
                "recipient": "Bot",
                "text": basicDetails.text,
                "channel": "FaceBook",
                "timestamp": "2019-04-29T18:12:50.231Z",
                "conversationID": conversationId,
                "id": crypto.randomBytes(8).toString("hex")
                // "id": "3590121f83984c2c",
                //  "intent": "intent_Greeting"
            }
        insightPrototype.logMessage(responseMessage);


    }



}
//watson bot object
var conversation = new Conversation({
    url: "https://gateway.watsonplatform.net/conversation/api",

    username: process.env.Watson_User_Name,

    password: process.env.Watson_User_Password,
    version: 'v1',
    version_date: '2018-03-03'
});

app.get('/fblogin', (req, res) => {
    res.sendFile(__dirname + '/Login/login.html');
});

app.get('/deleteAllDocuments',(req,res)=>{
    console.log("delete all documents");
    deleteAllDocuments().then(resData=>{
        console.log(resData);
        res.send('success');
    })

})
app.post('/endchat',(req,res)=>{

    console.log("inside endChat");
    enableBot({"fbId":req.body.id}).then(()=>{
    
        loginSuccessMessage(req.body.id, "You have been disconnected from the Agent");
    })
    res.send("bot is enabled");
    
})

app.get('/webhook/', (req, res) => {
    console.log('get webhook');
    if (req.query['hub.verify_token'] === 'MultiChannelBot') {
        res.send(req.query['hub.challenge']);
    } else
        res.send('Error when we try to validating your token.');
});
app.post('/webhook/', (req, res) => {

    res.sendStatus(200);
    console.log('this is post request');
    //console.log(JSON.stringify(req.body));
    for (let i = 0; i < req.body.entry[0].messaging.length; i++) {
        FbUserCheck({ fbId: req.body.entry[0].messaging[i].sender.id }).then((respData) => {
            console.log("respData", respData);
            if (respData.resData.docs.length == 0) {
                console.log("inside length==0");
                fbUserAdd({ fbId: req.body.entry[0].messaging[i].sender.id }).then((respBasicData) => {
                    console.log("respBasicData", respBasicData);
                    console.log('no context');
                    conversation.message({ workspace_id: process.env.Watson_Workspace }, function (err, res) {
                        if (err) {
                            console.log('error:', err);
                        }
                        else {
                            if(res.context.isAgentOn== false)
                            {
                                setBasicUserData1({ fbId: req.body.entry[0].messaging[i].sender.id, key: 'contextId', value: res.context }).then((respData) => {
                                    if (req.body.entry[0].messaging[i].message) {
                                        respBasicData.text = req.body.entry[0].messaging[i].message.text;
                                        respBasicData.fbId = req.body.entry[0].messaging[i].sender.id;
                                        // insightUserRequestFunction(respBasicData)
                                        loginSuccessMessage(req.body.entry[0].messaging[i].sender.id, "Hello, I’m your VIVA assistant bot. Before we get started, can you answer a few questions about yourself");
                                        // setTimeout(() => {
                                        //     loginSuccessMessage(req.body.entry[0].messaging[i].sender.id, "Before we get started, can you answer a few questions about yourself")
                                        // }, 3000);
    
                                        watsonRequest("new User", req.body.entry[0].messaging[i].sender.id);
                                    }
                                    else if (req.body.entry[0].messaging[i].postback) {
                                        respBasicData.text = req.body.entry[0].messaging[i].postback.payload;
                                        respBasicData.fbId = req.body.entry[0].messaging[i].sender.id;
                                        //  insightUserRequestFunction(respBasicData)
                                        loginSuccessMessage(req.body.entry[0].messaging[i].sender.id, "Hello, I’m your VIVA assistant bot. You can ask me about VIVA plans, services and more!")
                                        setTimeout(() => {
                                            loginSuccessMessage(req.body.entry[0].messaging[i].sender.id, "Before we get started, can you answer a few questions about yourself")
                                        }, 3000);
                                        watsonRequest("new User", req.body.entry[0].messaging[i].sender.id);
                                    }
    
                                })

                            }
                            else
                            {

                                console.log("Need to start socket implementation");
                                var fbid=req.body.entry[0].messaging[i].sender.id
                                var msg=req.body.entry[0].messaging[i].message
                                socketImplementation(fbid,msg)    

                          
                            }
                 
                        }
                    });
                })

            }
            else if (respData.resData.docs.length > 0) {
                //                        phoneNo=respData.resData.docs[0].PhoneNo;
                getBasicUserData({ fbId: req.body.entry[0].messaging[i].sender.id }).then((respBasicData) => {
                    console.log('inside get basic user data');
                    if (respBasicData.resData.contextId != "") {
                        if(respBasicData.resData.contextId.isAgentOn == false)
                        {
                            console.log('context available');
                            if (req.body.entry[0].messaging[i].message) {
                                respBasicData.text = req.body.entry[0].messaging[i].message.text;
                                respBasicData.fbId = req.body.entry[0].messaging[i].sender.id;
                                //  insightUserRequestFunction(respBasicData)
                                watsonRequest(req.body.entry[0].messaging[i].message.text, req.body.entry[0].messaging[i].sender.id);
                            }
    
                            else if (req.body.entry[0].messaging[i].postback) {
                                respBasicData.text = req.body.entry[0].messaging[i].postback.payload;
                                respBasicData.fbId = req.body.entry[0].messaging[i].sender.id;
                                //  insightUserRequestFunction(respBasicData)
                                watsonRequest(req.body.entry[0].messaging[i].postback.payload, req.body.entry[0].messaging[i].sender.id);
                            }

                        }
                        else
                        {
                            console.log("Need to implements sockets");
                            var fbid=req.body.entry[0].messaging[i].sender.id
                                var msg=req.body.entry[0].messaging[i].message
                                socketImplementation(fbid,msg)    

                      
                        }
                      
                    } else {
                        console.log('no context');
                        conversation.message({ workspace_id: process.env.Watson_Workspace }, function (err, res) {
                            if (err) {
                                console.log('error:', err);
                            }
                            else {
                                if(res.context.isAgentOn == false)
                                {
                                    setBasicUserData({ fbId: req.body.entry[0].messaging[i].sender.id, key: 'contextId', value: res.context }).then((respData) => {
                                        console.log('setBasic User Data');
                                        //console.log(respData.resData);
                                        if (req.body.entry[0].messaging[i].message) {
                                            respBasicData.text = req.body.entry[0].messaging[i].message.text;
                                            respBasicData.fbId = req.body.entry[0].messaging[i].sender.id;
    
                                            watsonRequest(req.body.entry[0].messaging[i].message.text, req.body.entry[0].messaging[i].sender.id);
                                        }
                                        else if (req.body.entry[0].messaging[i].postback) {
                                            respBasicData.text = req.body.entry[0].messaging[i].postback.payload;
                                            respBasicData.fbId = req.body.entry[0].messaging[i].sender.id;
                                            //   insightUserRequestFunction(respBasicData)
                                            watsonRequest(req.body.entry[0].messaging[i].postback.payload, req.body.entry[0].messaging[i].sender.id);
                                        }
    
                                    })
                                }
                                else
                                {
                                    var fbid=req.body.entry[0].messaging[i].sender.id
                                    var msg=req.body.entry[0].messaging[i].message
                                    socketImplementation(fbid,msg)    
    
                                
                                }
                          
                            }
                        });
                    }
                })
            }
        });


    }
});
app.get('/feedback', (req, res) => {
    // var fbUsers=["2694124463950281","2271641979621103"];
    listAllusers().then((response) => {
        response.resData.forEach(element => {
            if (element.fbId != "") {
                //console.log("IF");
                //  loginSuccessMessage(element.fbId, "60% off on all Jordans!");
                buttonSend3(element.fbId, "Thank you for visiting our store! Would you like to take part in a quick survey?")
                res.send('success')
                // notifications(element.fbId);
            }
            else {
                //console.log("ELSE");
                res.send("failed");
            }

        });

    })

})
app.get('/proactiveMessages', (req, res) => {
    // var fbUsers=["2694124463950281","2271641979621103"];
    // var data="10 25 12  12ext" replace /([^(\d+)])/ with "";
    var data = req.query.message.trim();
    listAllusers().then((response) => {
        response.resData.forEach(element => {
            if (element.fbId != "") {
                //console.log("IF");
                loginSuccessMessage(element.fbId, data);
                notifications(element.fbId);
                res.send('success')

            }
            else {
                //console.log("ELSE");
                res.send("failed");
            }
        });
    })
})
app.post('/checkCredentials', (req, res) => {
    //console.log('check credentials');
    //console.log("req.body.href", req.body.href);
    FbIdCheck({ fbId: req.body.href }).then((respData) => {
        //console.log("respData.resData.docs", respData.resData.docs.length);
        if (respData.resData == 'error') {
            //console.log('error occured');
            res.send('error');
            loginSend(req.body.entry[0].messaging[i].sender.id, "Sorry, something went wrong. Please login again!");
        } else if (respData.resData.docs.length > 0) {
            // //console.log('user available');
            // res.send({ key: 'available', value: "You are already logged in!" });
            // loginSuccessMessage(req.body.href, "Hey, you are already logged in! Continue your chat.")
            TFARegister({ phoneNo: respData.resData.docs[0].phoneNo }).then((respData) => {
                //console.log('checking req.body.href', req.body.href);
                if (respData.resData.result.status == 0) {
                    setBasicUserData({ fbId: req.body.href, key: 'requestId', value: respData.resData.result.request_id }).then((respData) => {
                        //console.log('setBasic User Data');
                        loginSuccessMessage(req.body.href, "You are successfully logged in! You will get a verification code to your mobile. Please enter the verification code.")
                        //  buttonSend1(id)
                    })
                } else if (respData.resData.result.status == 3) {
                    //console.log("invalid phone number")
                    loginSuccessMessage(req.body.href, "Your registered phone number doesn't exist. Please check the number and try again!");
                } else if (respData.resData.result.status == 9) {
                    //console.log("Your nexmo account does not have sufficient credit to process this request")
                    loginSuccessMessage(req.body.href, "Our server is busy now. Please try again!");
                } else if (respData.resData.result.status == 10) {
                    //console.log("Concurrent verifications to the same number are not allowed")
                    loginSuccessMessage(req.body.href, "Our server is busy now. Please try again after 10 minutes");
                } else if (respData.resData.result.status == 15) {
                    //console.log("The destination number is not in a supported network")
                    loginSuccessMessage(req.body.href, "Please check your registered phone number and try again!");
                } else {
                    loginSuccessMessage(req.body.href, "Our server is busy now. Please try again after some time")
                }

                res.send({ key: 'success', value: "You are successfully logged in!" });

            })
        } else if (respData.resData.docs.length == 0) {
            FbIdAdd({ fbId: req.body.href, userEmail: req.body.userName, userPassword: req.body.userPassword }).then((respData) => {
                if (respData.resData == 'fbIdExist') {
                    res.send({ key: 'wrongCredentials', value: "Sorry, You are already logged in with these credentials in some other facebook ID!" });
                }
                if (respData.resData == 'wrongCredentials') {
                    res.send({ key: 'wrongCredentials', value: "You have entered wrong credentials. Please try again!" });
                } else if (respData.resData == 'error') {
                    res.send({ key: 'error', value: "Server is busy, please try again!" });
                } else if (respData.resData.ok == true) {
                    //console.log('added success');
                    TFARegister({ phoneNo: respData.resData.phoneNo }).then((respData) => {
                        if (respData.resData.result.status == 0) {
                            setBasicUserData({ fbId: req.body.href, key: 'requestId', value: respData.resData.result.request_id }).then((respData) => {
                                //console.log('setBasic User Data');
                                loginSuccessMessage(req.body.href, "You are successfully logged in! You will get a verification code to your mobile. Please enter the verification code.")

                            })
                        } else if (respData.resData.result.status == 3) {
                            //console.log("invalid phone number")
                            loginSuccessMessage(req.body.href, "Your registered phone number doesn't exist. Please check the number and try again!");
                        } else if (respData.resData.result.status == 9) {
                            //console.log("Your nexmo account does not have sufficient credit to process this request")
                            loginSuccessMessage(req.body.href, "Our server is busy now. Please try again!");
                        } else if (respData.resData.result.status == 10) {
                            //console.log("Concurrent verifications to the same number are not allowed")
                            loginSuccessMessage(req.body.href, "Our server is busy now. Please try again after 5 minutes");
                        } else if (respData.resData.result.status == 15) {
                            //console.log("The destination number is not in a supported network")
                            loginSuccessMessage(req.body.href, "Please check your registered phone number and try again!");
                        } else {
                            loginSuccessMessage(req.body.href, "Our server is busy now. Please try again after some time")
                        }
                        // else{
                        //     loginSuccessMessage(req.body.href,"You are successfully logged in! Server is busy now, please try agian after 5 minutes for verification.")

                        // }
                        res.send({ key: 'success', value: "You are successfully logged in!" });

                    })
                } else {
                    //console.log('added/data not matched');
                    res.send({ key: 'error', value: "Server is busy, please try again!" });
                }
            })
        }
    })
})
function socketImplementation(fbid,msg){
    console.log("inside socketsimp")
    var options = {
        method: 'POST',
        uri: 'https://1fc1f3f8.ngrok.io/getRequest',
        body: {
            "fbId":fbid,
            "msg":msg.text
        },
        json: true // Automatically stringifies the body to JSON
    };
     
    rp(options)
        .then(function (parsedBody) {
            console.log("parsedBody",parsedBody);
        })
        .catch(function (err) {
            console.log("error",err);
        });

}
function notifications(id) {
    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: "https://images.unsplash.com/photo-1556742504-16b083241fab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80 ",
                        is_reusable: true
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}
function loginSuccessMessage(id, text) {

    getBasicUserData({ fbId: id }).then((getResponse) => {
        getResponse.text = text;
        getResponse.id = id
        insightBotResponseFunction(getResponse);
    })
    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                text: text
            }
        }
    };
    requestFun(dataPost)
}
//
function buttonSend3(id, message) {

    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: message,
                        buttons:
                            [
                                {
                                    "type": "postback",
                                    "title": "Yes",
                                    "payload": "Send feedback"
                                },
                                {
                                    "type": "postback",
                                    "title": "No",
                                    "payload": "No"
                                }
                            ]
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}


function buttonSend2(id, message) {

    var ButtonValues = ["Prepaid plans", "Sim Registration", "Add-Ons"]
    var buttonsAppendText = message;
    var buttons = [];
    for (var i = 0; i < ButtonValues.length; i++) {
        buttons.push({
            "type": "postback",
            "title": ButtonValues[i],
            "payload": ButtonValues[i]
        });
        buttonsAppendText = buttonsAppendText + " -> " + ButtonValues[i];
        if (i == ButtonValues.length - 1) {
            getBasicUserData({ fbId: id }).then((getResponse) => {
                getResponse.text = buttonsAppendText;
                getResponse.id = id
                insightBotResponseFunction(getResponse);
            })
        }

    }

    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: message,
                        buttons: buttons
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}
//send buttons to facebook
function buttonSend1(id, message) {

    var ButtonValues = ["2 GB Data Pack", "International Calling Pack", "Free Messaging Pack"]

  //  var ButtonValues = ["Prepaid Data Add ons", "Postpaid Data Add ons", "Favourite Country"]
    var buttonsAppendText = message;
    var buttons = [];
    for (var i = 0; i < ButtonValues.length; i++) {
        buttons.push({
            "type": "postback",
            "title": ButtonValues[i],
            "payload": ButtonValues[i]
        });
        buttonsAppendText = buttonsAppendText + " -> " + ButtonValues[i];
        if (i == ButtonValues.length - 1) {
            getBasicUserData({ fbId: id }).then((getResponse) => {
                getResponse.text = buttonsAppendText;
                getResponse.id = id
                insightBotResponseFunction(getResponse);
            })
        }

    }

    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: message,
                        buttons: buttons
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}
//send buttons to facebook
function buttonSend(id, data) {
    //console.log("data in button send", data);
    //console.log("button values", data.ButtonValues);
    var buttonsAppendText = data.message;
    var buttons = [];
    for (var i = 0; i < data.ButtonValues.length; i++) {
        buttons.push({
            "type": "postback",
            "title": data.ButtonValues[i],
            "payload": data.ButtonValues[i]
        });
        buttonsAppendText = buttonsAppendText + " -> " + data.ButtonValues[i];
        if (i == data.ButtonValues.length - 1) {
            getBasicUserData({ fbId: id }).then((getResponse) => {
                getResponse.text = buttonsAppendText;
                insightBotResponseFunction(getResponse);
            })
        }
    }



    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: data.message,
                        buttons: buttons
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}
//login button for facebook
function loginSend(id, text) {

    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text,
                        buttons: [
                            {
                                "type": "account_link",
                                "url": "https://f4cde5f8.ngrok.io/fblogin?id=" + id,
                            }
                        ]
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}

//request function
function requestFun(dataPost) {

    request(dataPost, (error, response, body) => {
        if (error) {
            //console.log('Error when we try to sending message: ', error);
        } else if (response.body.error) {
            //console.log('Error: ', response.body.error);
        }
    });

}
function broadBandCards(id, data) {
    //console.log("data in sendCards", data);
    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "template",
                    "payload": {
                        "template_type": "list",
                        "elements": [
                            {
                                "title": "Broadband plans",
                                // "color":"#FF0000",
                                "image_url": " http://www.sahyadigital.com/site_assets/theme/img/broadband.jpg",
                                //  "subtitle": "Tiempos: 9AM to 8PM",
                                // "default_action": {
                                //     "type": "web_url",
                                //     "url": "https://www.miraclesoft.com",
                                //     "webview_height_ratio": "tall",
                                // }
                            },
                            {
                                "title": data.ButtonValues[0],
                                // "color":"#FF0000",
                                // "image_url": "https://nikonrumors.com/wp-content/uploads/2014/03/Nikon-1-V3-sample-photo.jpg",
                                "subtitle": "Monthly rental BD 12 with 40 GB data and 12 Mbps speed.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.miraclesoft.com",
                                    "webview_height_ratio": "tall",
                                }

                            },
                            {
                                "title": data.ButtonValues[1],
                                // "color":"#FF0000",
                                //  "image_url": "https://nikonrumors.com/wp-content/uploads/2014/03/Nikon-1-V3-sample-photo.jpg",
                                "subtitle": "Monthly rental BD 15 with 140 GB data and Maximum 4G+ speed.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.miraclesoft.com",
                                    "webview_height_ratio": "tall",
                                }

                            },
                            {
                                "title": data.ButtonValues[2],
                                // "color":"#FF0000",
                                // "image_url": "https://nikonrumors.com/wp-content/uploads/2014/03/Nikon-1-V3-sample-photo.jpg",
                                "subtitle": "Monthly rental BD 20 with 200 GB data and Maximum 4G+ speed",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.miraclesoft.com",
                                    "webview_height_ratio": "tall",
                                }

                            }
                        ]
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}
function sendCards1(id, data) {
    //console.log("data in sendCards", data);
    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                attachment: {
                    type: "template",
                    "payload": {
                        "template_type": "list",
                        "elements": [
                            {
                                "title": "Prepaid plans",
                                // "color":"#FF0000",
                                "image_url": "https://www.smeventure.com/wp-content/uploads/2019/04/digital-1.jpg",
                                //"subtitle": "Tiempos: 9AM to 8PM",
                            },
                            {
                                "title": data.ButtonValues[0],
                                // "color":"#FF0000",
                                // "image_url": "https://nikonrumors.com/wp-content/uploads/2014/03/Nikon-1-V3-sample-photo.jpg",
                                "subtitle": "Free local minutes 500, Free Data 8 GB",

                            },
                            {
                                "title": data.ButtonValues[1],
                                // "color":"#FF0000",
                                //  "image_url": "https://nikonrumors.com/wp-content/uploads/2014/03/Nikon-1-V3-sample-photo.jpg",
                                "subtitle": "Free local minutes 500, Free Data 6 GB",

                            },
                            {
                                "title": data.ButtonValues[2],
                                // "color":"#FF0000",
                                // "image_url": "https://nikonrumors.com/wp-content/uploads/2014/03/Nikon-1-V3-sample-photo.jpg",
                                "subtitle": "Free local minutes 100, Free Data 1 GB",

                            }
                        ]
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}

function sendCards(id, data) {
    //console.log("data in sendCards", data);
    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.Facebook_Token },
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {  
                attachment: {
                    type: "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            // {
                            //     "title": "PostPaid palns",
                            //     // "color":"#FF0000",
                            //     "image_url": "https://cdn3.vectorstock.com/i/1000x1000/97/77/mobile-data-exchange-icon-colored-symbol-premium-vector-23579777.jpg",
                            //     "subtitle": "Telecommunications ",
                            // },
                            {
                                "title": "Postpaid: " + data.ButtonValues[0],
                                // "color":"#FF0000",
                                "image_url": "https://cdn3.vectorstock.com/i/1000x1000/97/77/mobile-data-exchange-icon-colored-symbol-premium-vector-23579777.jpg",
                                "subtitle": "Monthly Rental BD 8, Local Minutes 700, Data 10 GB"

                            },
                            {
                                "title": "Postpaid: " + data.ButtonValues[1],
                                // "color":"#FF0000",
                                "image_url": "https://cdn3.vectorstock.com/i/1000x1000/97/77/mobile-data-exchange-icon-colored-symbol-premium-vector-23579777.jpg",
                                "subtitle": "Monthly Rental BD 12, Local Minutes 1000, Data 15 GB",

                            },
                            {
                                "title": "Postpaid: " + data.ButtonValues[2],
                                // "color":"#FF0000",
                                "image_url": "https://cdn3.vectorstock.com/i/1000x1000/97/77/mobile-data-exchange-icon-colored-symbol-premium-vector-23579777.jpg",
                                "subtitle": "Monthly Rental BD 16, Local Minutes 1500, Data 22 GB",

                            }
                        ]
                    }
                }
            }
        }
    };
    requestFun(dataPost)
}

//watson conversation
function watsonRequest(input, id) {
    //console.log('this is input data')
    //console.log(input)

    getBasicUserData({ fbId: id }).then((respBasicData) => {
        //console.log("respBasicData", respBasicData);
        ////console.log(respBasicData.resData);
        var payload =
        {
            workspace_id: process.env.Watson_Workspace,
            input: { "text": input },
            context: respBasicData.resData.contextId
        }

        conversation.message(payload, function (err, responseMessage) {
            if (err) {
                //console.log('inside conversation')
                //console.log('error occured');
            }
            else {
                //console.log('watson response', responseMessage);
                //if(JSON.parse(responseMessage.intents[0].intent != null))
                if (JSON.parse(responseMessage.intents.length != 0)) {
                    var data = {
                        "fbId": id,
                        "text": input,
                        "contextId": responseMessage.context,
                        "intent": responseMessage.intents[0].intent

                    }
                } else {
                    var data = {
                        "fbId": id,
                        "text": input,
                        "contextId": responseMessage.context,
                        "intent": ""

                    }
                }

                insightUserRequestFunction(data);
                if (responseMessage.output.text[0].includes("action")) {
                    if (JSON.parse(responseMessage.output.text[0]).action == 'process') {
                        if (JSON.parse(responseMessage.output.text[0]).data.function == 'OTP') {
                            //console.log('this is otp');
                            //  //console.log('this is otp');
                            getBasicUserData1({ fbId: id }).then((respBasicData) => {
                                //console.log("respBasicData", respBasicData);
                                // //console.log(respBasicData.resData);
                                TFACheck({ requestId: respBasicData.resData.requestId, pin: input }).then((respData) => {
                                    if (respData.resData == 0) {
                                        //console.log('this is after process');
                                        //  loginSuccessMessage(id, "Sure, Please check out the most exciting add ons available in VIVA");
                                        buttonSend1(id, "Sure, Please check out the most exciting add ons available in VIVA")
                                    } else if (respData.resData == 2) {
                                        //console.log("Missed the mandatory parameter")
                                        loginSuccessMessage(id, "You have entered wrong Verification code. Please try again!");
                                    } else if (respData.resData == 6) {
                                        //console.log('verification code has been expired');
                                        loginSuccessMessage(id, "Server is busy now, please try again after sometime");
                                    } else if (respData.resData == 16) {
                                        //console.log('Invalid verification code');
                                        loginSuccessMessage(id, "That is an invalid verification code, please try again!");
                                    } else if (respData.resData == 17) {
                                        TFACancel({ requestId: respBasicData.resData.requestId }).then((respData) => {
                                            loginSuccessMessage(id, "No of wrong attempts reached, your account is locked out for 5 min from now.");
                                        })
                                    } else {
                                        loginSuccessMessage(id, "Server is busy now, please try again after " + respData.resData + " minutes");

                                    }
                                });
                            });
                            // if (responseMessage.output.text.length == 1) {
                            //     messageForwardOrProcess(respBasicData, JSON.parse(responseMessage.output.text[0]));
                            // }

                            // else {
                            //     messageForwardOrProcess(respBasicData, JSON.parse(responseMessage.output.text[0]));
                            //     setTimeout(() => {
                            //         messageForwardOrProcess(respBasicData, JSON.parse(responseMessage.output.text[1]));
                            //     }, 10000)
                            // }
                            // messageForwardOrProcess(respBasicData, JSON.parse(responseMessage.output.text[0]));

                        } else {
                            setBasicUserData1({ fbId: id, key: 'contextId', value: responseMessage.context }).then((respData) => {
                                //console.log('setBasic User Data');
                                // //console.log(respData.resData);
                                messageForwardOrProcess(id, JSON.parse(responseMessage.output.text[0]));
                            })
                        }
                    }
                    else {
                        setBasicUserData1({ fbId: id, key: 'contextId', value: responseMessage.context }).then((respData) => {
                            //console.log('setBasic User Data');
                            // //console.log(respData.resData);
                            messageForwardOrProcess(id, JSON.parse(responseMessage.output.text[0]));
                        })
                    }
                    //  //console.log('this is message');
                }
                else {
                    setBasicUserData1({ fbId: id, key: 'contextId', value: responseMessage.context }).then((respData) => {
                        //console.log('setBasic User Data');
                        // //console.log(respData.resData);
                        messageForwardOrProcess(id, responseMessage.output.text[0]);
                    })
                }

                //   messageForwardOrProcess(id, JSON.parse(responseMessage.output.text[0]));
                ////console.log(responseMessage.output.text[0]);
            }
        });
    });
}


//check whether the response is to forward or to process
function messageForwardOrProcess(id, messageLocal) {
    if (messageLocal.action == 'forward') {
        if (messageLocal.hasOwnProperty('ButtonValues')) {
            //console.log('buttons available');
            var buttonsAppendText = messageLocal.message;
            var buttons = [];
            for (let i = 0; i < messageLocal.ButtonValues.length; i++) {
                buttons.push({
                    "type": "postback",
                    "title": messageLocal.ButtonValues[i],//SOME ONE ELSE
                    "payload": messageLocal.ButtonValues[i]//soneoneelse
                });
                buttonsAppendText = buttonsAppendText + " -> " + messageLocal.ButtonValues[i];
                if (i == messageLocal.ButtonValues.length - 1) {
                    getBasicUserData({ fbId: id }).then((getResponse) => {
                        getResponse.text = buttonsAppendText;
                        getResponse.id = id;
                        insightBotResponseFunction(getResponse);
                    })
                }
            }
        }
        else {
            //console.log('no buttons');
            loginSuccessMessage(id, messageLocal.message);
        }

    }
    else if (messageLocal.action == 'process') {
        //console.log('!---------message is processing----------!');

        getBasicUserData({ fbId: id }).then((respBasicData) => {
            // //console.log("respBasicData", respBasicData.resData.contextId);
            // //console.log("messageLocal in", messageLocal);
            // //console.log("messageLocal in", messageLocal.data);
            //console.log("messageLocal.data.function", messageLocal.data.function);

            if (messageLocal.data.function == 'addNewUser') {
                //console.log("inside addNewUser");
                updateUserDetails({ "fbId": id, "userEmail": respBasicData.resData.contextId.Email, "phoneNo": respBasicData.resData.contextId.Ph_number, "userName": respBasicData.resData.contextId.Name }).then(() => {
                    //  loginSuccessMessage(id, "Thank you for the info, you can ask me about VIVA plans & services. ");
                    buttonSend2(id, "Perfect! Now, how can I help you today?")
                })
            }
            else if (messageLocal.data.function == 'Postpaid') {
                //console.log("messageLocal in", messageLocal);
                loginSuccessMessage(id, messageLocal.data.message);
                sendCards(id, messageLocal.data)
            }
            else if (messageLocal.data.function == 'Prepaid') {
                //console.log("messageLocal in", messageLocal);
                loginSuccessMessage(id, messageLocal.data.message);
                sendCards1(id, messageLocal.data)
            }
            else if (messageLocal.data.function == 'SimCard') {
                //console.log("messageLocal in", messageLocal.data);
                // loginSuccessMessage(id, messageLocal.data.message);
                buttonSend(id, messageLocal.data)
            }
            else if (messageLocal.data.function == "Broadband") {
                loginSuccessMessage(id, messageLocal.data.message);
                broadBandCards(id, messageLocal.data)
            }
            else if (messageLocal.data.function == "AddOns") {
                loginSend(id, "I can help you with that.Could you please sign in here.");
            }
            else if (messageLocal.data.function == "staff") {
                buttonSend(id, messageLocal.data);
            }
            else if (messageLocal.data.function == "storeClean") {
                buttonSend(id, messageLocal.data);
            }
            else if (messageLocal.data.function == "Statement") {
              findEmail({fbId:id}).then((email)=>{
                //console.log("email",email.email);
            //    var msg = messageLocal.data+" "+ email
            messageLocal.data.message = messageLocal.data.message+" "+ email.email
                  buttonSend(id, messageLocal.data);
              })
              //  buttonSend(id, messageLocal.data);
            }
            // else if (messageLocal.data.function == "EmailStatement") {
            //     sendEmail({"fbId":id}).then(()=>{
            //         loginSuccessMessage(id, messageLocal.data.message);
            //     })

            // }
            else if (messageLocal.data.function == "EmailStatement") {
                sendEmail({"fbId":id}).then(()=>{
                    loginSuccessMessage(id, messageLocal.data.message);
                })

            }
            else if (messageLocal.data.function == "updateEmail") {
                updateEmail({"fbId":id,"userEmail":(messageLocal.data.ID)}).then(()=>{
                  //  loginSuccessMessage(id, messageLocal.data.message);
                      loginSuccessMessage(id, "Is there anything else I can help you with.");
                })
            
            }
            else if (messageLocal.data.function == "connectToAgent") {
              
                updateContext({"fbId":id}).then((data)=>{
                    console.log("inside connect agent",data);
                    loginSuccessMessage(id, "Please give me a moment while we find you an agent.");

                })
            }

        });

    }
    else {
        //console.log("messageLocal in else", messageLocal);
        loginSuccessMessage(id, messageLocal);

    }
    var creditDebitCardVal = {
        creditCard: "credit card",
        debitCard: "debit card",
        Savings: "savings",
        Checking: "checking"
    }

    function afterOtpProcessFun(messageLocal, phoneNo) {
        if (Object.keys(messageLocal).length == 0) {
            //console.log('this is first process');
        }

    }
}

http.listen(process.env.PORT || 8080, () => {
    console.log("App is running successfully");
});
