const Web3 = require('web3');
const artifacts = require("./artifacts/contracts/Erc1484.sol/Erc1484.json");
let deployedHardhatAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
 const routes = async(app) => {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    instance = new web3.eth.Contract(artifacts["abi"], deployedHardhatAddress);
    accounts = await web3.eth.getAccounts();
    app.get('/', (req, res) => {
        res.json({ message: 'WELCOME!' });
    })

    app.get('/identity/:id', async(req, res) => {
        // console.log(instance.methods);
        if(req.params.id){
            let ein = req.params.id;
            console.log(ein);
            // console.log(req);
        

            instance.methods.getIdentity(ein).call()
            .then((result) => {
                console.log(result);
                res.send(result);
            })
            .catch((error) => {
                console.log(error);
                res.status(400).json({"status":"Failed", "error": error});
            })
            
        }
    // }
    //     else if(req.query.address) {
    //         let address = req.query.address;
    //         console.log(address);
    //         try {
    //             let EIN = await instance.methods.getEIN(address).call();
    //             console.log(EIN);
    //             let identity = await instance.methods.getIdentity(EIN).call()
    //             res.send(identity);
    //         }
    //         catch(error) {
    //             res.status(400).json({"status":"Failed", error});
    //         }
    //     }

    //     else {
    //         res.status(400).json({"status":"Failed", "reason":"wrong query parameter"});
    //     }
    // })

    // app.post('/identity/', async (req, res) => {
    //     if(!req.body) {
    //         res.status(400).send({message: "Content cannot be empty!"});
    //         return;
    //     }

    //     try {
    //         console.log("hi");
    //         console.log(req.body.recoveryAddress);
    //         console.log(req.body.providers);
    //         console.log(req.body.resolvers);
    //         console.log("bye");
    //         let ans = await instance.methods.createIdentity(
    //                         req.body.recoveryAddress, 
    //                         req.body.providers, 
    //                         req.body.resolvers)
    //                         .send({from: accounts[0]});
    //         let rValues = ans.events.IdentityCreated.returnValues
    //         res.send(`Created an identity with ein = ${rValues.ein}  
    //                 associatedAddress = ${rValues.associatedAddress}
    //                 providers = ${rValues.providers}
    //                 resolvers = ${rValues.resolvers}
    //                 `);
    //     }
    //     catch(error) {
    //         res.status(400).json({"status":"Failed", error});
    //     }
        
    })
    app.get('/associatedAddress/', async(req, res) => {
        if(req.body){
            let ein = req.body.ein;
            console.log(ein);
            // console.log(req);
        

            instance.methods.isAssociatedAddressFor(ein,req.body.address).call()
            .then((result) => {
                console.log(result);
                res.send(result);
            })
            .catch((error) => {
                console.log(error);
                res.status(400).json({"status":"Failed", "error": error});
            })
            
        }
    })
    app.post('/createIdentity/',async(req,res)=>{
        try{
            console.log(req.body.providers);
            console.log(req.body.resolvers);
            let even = await instance.methods.createIdentity(req.body.recovery,req.body.providers,req.body.resolvers)
            .send({'from':accounts[0]});
            console.log(even);
            let rValues = even.events.IdentityCreated.returnValues;
            res.send(`Created an identity with ein = ${rValues.ein}  
                           associatedAddress = ${rValues.associatedAddress}
                             providers = ${rValues.providers}
                             resolvers = ${rValues.resolvers}                 `);        }
        catch(err){
            console.log(err);
        }
        })
    app.post('/createIdentityDelegated/',async(req,res)=>{
            try{
                console.log(req.body.providers);
                console.log(req.body.resolvers);
                let even = await instance.methods.createIdentityDelegated(req.body.recovery,accounts[0],req.body.providers,req.body.resolvers,
                    28,'0x58802585e6945bd39730a58c89c258ceccb24ccb96aa8d7d273c6607b21e9c62', '0x6d01eb97502d788f0a1a01ad20923f8f6817e79d8f4497d154642410aacef61b',1)
                .send({'from':accounts[0]});
                console.log(even);

                let rValues = even.events.IdentityCreated.returnValues;
                res.send(`Created an identity with ein = ${rValues.ein}  
                               associatedAddress = ${rValues.associatedAddress}
                                 providers = ${rValues.providers}
                                 resolvers = ${rValues.resolvers}`);
                
            }
            catch(err){
                console.log(err);
            }
            })
    app.post('/addAssociated/',async(req,res)=>{
                try{
                    let even = await instance.methods.addAssociatedAddress(req.body.address,accounts[0],
                        28,'0x58802585e6945bd39730a58c89c258ceccb24ccb96aa8d7d273c6607b21e9c62', '0x6d01eb97502d788f0a1a01ad20923f8f6817e79d8f4497d154642410aacef61b',1)
                    .send({'from':accounts[0]});
                    let rValues = even.events.AssociatedAddressAdded.returnValues;
                    res.send(`Created an identity with ein = ${rValues.ein}  
                                   associatedAddress = ${rValues.approvingAddress}
                                     added Address = ${rValues.addedAddress}`);
                }
                catch(err){
                    console.log(err);
                }
                })
    app.post('/triggerDestruction/',async(req,res)=>{
        try{
        let even = await instance.methods.triggerDestruction(req.body.ein,[],[],req.body.clear)
             .send({'from':accounts[0]});
        let rValues = even.events.IdentityDestroyed.returnValues;
        // res.send(`Created an identity with ein = ${rValues.ein}  
        //           recoveryAddress = ${rValues.recoveryAddress}`);
        res.status(200).json({"ein":rValues.ein,"recoveryAddress":rValues.recoveryAddress})
        }
        catch(err){
            console.log(err);
        }
        })
}


module.exports = routes;