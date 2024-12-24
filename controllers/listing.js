const Listing = require("../models/listing.js");

const mapbox = require('@mapbox/mapbox-sdk');
const mapboxClient = mapbox({ accessToken: process.env.Map_Token });


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.Map_Token;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req,res)=>{
    let listings = await Listing.find();
    res.render("listings/index.ejs", {listings});
};

// create new listing
module.exports.createNewget = (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.createNewpost = async(req,res,next)=>{

    let response = await geocodingClient.forwardGeocode({
        query:req.body.location,
        limit: 1
    })
    .send() 
    
    let url = req.file.path;
    let filename = req.file.filename;
    let{title,description,price,location,country}=req.body;
    let createNew = new Listing({title:title,description:description,price:price,location:location,country:country});

    createNew.owner = req.user._id;
    createNew.image = {url,filename};

    createNew.geometry = response.body.features[0].geometry;

    let savedListing = await createNew.save();
    console.log(savedListing);
    req.flash("success","New Listing Added Successfully!");
    res.redirect("/listings");
};

// show
module.exports.showRoute = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

// update
module.exports.updateget = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    let originalImageUrl= originalImage.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};
module.exports.updatepatch = async(req,res)=>{

    let {id} = req.params;
    let{title,description,image,price,location,country}=req.body;

    let listing = await Listing.findByIdAndUpdate(id, {title:title,description:description,price:price,location:location,country:country}, {runValidators:true}, {new:true});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    

    req.flash("success","Listing Updated Successfully!");
    res.redirect("/listings");
};

// delete
module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};