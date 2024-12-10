const asyncHandler = require('express-async-handler');
const { errorRes, successRes } = require('../../config/app.response');
const Package = require('../../models/admin/packages.model');
const fs = require('fs');

exports.listPackages = asyncHandler(async (_, res) => {
    try {
        const packages = await Package.find();
        if(!packages) {
            return res.status(404).json(errorRes(
                404,
                "NOT FOUND",
                "No packages found"
            ));
        }
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Packages fetched successfully",
            packages
        ))
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
})
// TODO: Create Package 
exports.createPackage = asyncHandler(async(req, res) => {
    try {
        const data = req.body;
        if(!req.files['featured_image']) {
            return res.status(422).json(errorRes(
                422,
                "BAD REQUEST",
                "Featured image is required"
            ))
        }

        const convertedTitle = data.package_title.toLowerCase();
        let slug = convertedTitle.replace(/[^a-z0-9-]+/g, '-');
        // Check if slug exists
        const packagesCnt = await Package.countDocuments({package_slug: slug});
        slug = packagesCnt >= 1 ? `${slug}-${Date.now().toString()}` : slug;
        const packageData = {
            package_title: data.package_title,
            package_slug: slug,
            package_desc: data.package_desc,
            number_of_days: data.number_of_days,
            number_of_nights: data.number_of_nights,
            price_deluxe: data.price_deluxe,
            price_super_deluxe: data.price_super_deluxe,
            package_inclusions: JSON.parse(data.package_inclusions),
            package_itinerary: JSON.parse(data.package_itinerary),
            featured_image: `/uploads/packagesUploads/${req.dirUniqueId}/${req.files['featured_image'][0].filename}`,
            gallery_images: req.files['gallery_images'] ? req.files['gallery_images'].map(file => `/uploads/packagesUploads/${req.dirUniqueId}/${file.filename}`) : [],
            category_id: data.category_id,
            from_date: data.from_date,
            to_date: data.to_date,
            pax_count: data.pax_count,
            dir_unique_id: req.dirUniqueId,
            status: data.status
        }
        const package = await Package.create(packageData);
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Package created successfully",
        ))
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
})
// TODO: Get Package Details by Id
exports.getPakcage = asyncHandler(async(req, res) => {
    try {
        const packageData = await Package.findById(req.params?.id);
        if(!packageData) {
            return res.status(404).json(errorRes(
                404,
                "NOT FOUND",
                "No packages found"
            ));
        }
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Package fetched successfully",
            packageData
        ))
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
})
// TODO: Edit Package
exports.updatePackage = asyncHandler(async(req, res) => {
    try {
        const data = req.body;
        const oldPackageData = await Package.findById(req.params?.id);
        const packageData = {
            package_title: data.package_title,
            package_desc: data.package_desc,
            number_of_days: data.number_of_days,
            number_of_nights: data.number_of_nights,
            price_deluxe: data.price_deluxe,
            price_super_deluxe: data.price_super_deluxe,
            package_inclusions: JSON.parse(data.package_inclusions),
            package_itinerary: JSON.parse(data.package_itinerary),
            category_id: data.category_id,
            from_date: data.from_date,
            to_date: data.to_date,
            pax_count: data.pax_count,
            status: data.status
        }
        if(req.files && req.files['featured_image']) {
            if(oldPackageData.featured_image) {
                fs.unlinkSync('./public' + oldPackageData.featured_image);
            }
            packageData.featured_image = `/uploads/packagesUploads/${req.dirUniqueId}/${req.files['featured_image'][0].filename}`;
        }
        let galleyImages = [];

        // Handeling old image files
        const oldGalleyImages = JSON.parse(data.old_gallery_images);
        if(oldPackageData.gallery_images.length > 0) {
            oldPackageData.gallery_images.forEach(image => {
                var deleteFile = true;
                if(oldGalleyImages.length > 0 && oldGalleyImages.includes(image)) {
                    deleteFile = false;
                    galleyImages.push(image);
                }
                if(deleteFile) {
                    fs.unlinkSync('./public' + image);
                }
            })
        }
        // Handeling newly uploaded image files
        if(req.files && req.files['gallery_images']) {
            req.files['gallery_images'].map(file => {
                galleyImages.push(`/uploads/packagesUploads/${req.dirUniqueId}/${file.filename}`);
            });
        }
        packageData.gallery_images = galleyImages;

        const package = await Package.findByIdAndUpdate(req.params.id, packageData, {new: true});
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Package updated successfully",
            packageData
        ))
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
});
// TODO: Delet Package
exports.deletePackage = asyncHandler(async(req, res,) => {
    try {
        const package = await Package.findById(req.params?.id);
        if(!package) {
            return res.status(404).json(errorRes(
                404,
                "BAD REQUEST",
                "Coudl not able to find package!"
            ));
        } 
        fs.rmSync(`./public/uploads/packagesUploads/${package.dir_unique_id}/`, { recursive: true, force: true });
        await Package.deleteOne({_id: req.params?.id});
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Package deleted successfully",
        ))
    } catch (error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
});