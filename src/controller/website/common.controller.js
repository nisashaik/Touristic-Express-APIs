const asyncHandler = require('express-async-handler');
const Category = require('../../models/admin/categories.model');
const Package = require('../../models/admin/packages.model');
const Favourite = require('../../models/admin/favourites.model');
const { errorRes, successRes } = require('../../config/app.response');
const PackageListResource = require('../../resources/package.list.resource');
const { search } = require('../../routes/website/website.routes');

exports.listPackageCategories = asyncHandler(async(req, res) => {
    try {
        const categories = await Category.find({status: 'active'});
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Categories fetched successfully",
            categories
        ));
    } catch(error) {
        res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
});
/**
 * List packages
*/
exports.listPackages = asyncHandler(async(req, res) => {
    try {
        const {filters, pagination} = req.body;
        const perPage = (pagination?.per_page && pagination.per_page != "" ) ? pagination.per_page : 1;
        const currentPage = (pagination?.current_page && pagination?.current_page != "") ? pagination?.current_page : 1;
        const sortBy = (pagination?.sort_by && pagination?.sort_by != "") ? pagination?.sort_by : 'asc';
        const queryFilters = {status: true};
        
        Object.keys(filters).forEach((key) => {
            let {columnName, searchIn} = getDBColName(key);
            if(filters[key] != '' ) {
                queryFilters[columnName] = searchIn ? { $in:  filters[key] } : filters[key];
            }
        }); 
        const packages = await Package.find(queryFilters).populate('category_id').sort( {createdAt: sortBy }).limit(perPage).skip( currentPage == 1 ? 0 : (perPage * (currentPage - 1)) );
        const totalPackages = await Package.find(queryFilters).countDocuments();
        const metaData = {
            total: totalPackages,
            per_page: perPage,
            current_page:  currentPage,
            total_pages: totalPackages <= perPage && totalPackages > 0 ? 1 : Math.round( totalPackages / perPage )
        }
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Packages fetched successfully",
            PackageListResource.collection(packages),
            metaData
        ))
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
})
function getDBColName(name) {
    const dbKeys = {
        members: {
            columnName: 'pax_count',
            searchIn: false
        },
        days: {
            columnName: 'number_of_days',
            searchIn: true
        },
        category: {
            columnName: 'category_id',
        }
    }
    return dbKeys[name];
}
/**
 * Get Package
*/
exports.getPackage = asyncHandler(async(req, res) => {
    try {
        const slug = req.params?.slug;
        const package = await Package.find({package_slug: slug}).populate('category_id');
        if(package.length == 0) {
            return res.status(404).json(
                errorRes(
                    404,
                    "Requested Resource not found"
                )
            )
        }
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Package Details fetched successfully",
            PackageListResource.collection(package),
        ))
    } catch(error) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            error
        ))
    }
});
/**
 * Get Favourites
*/
exports.favourites = asyncHandler(async(req, res) => {
    try {
        const favPackages = await Favourite.find({customer_id: req.customer._id}).select("-customer_id -_id -__v");
        const pkgsSlug = favPackages.map(pkg => pkg.package_slug );
        const Packages = await Package.find({package_slug: {$in : pkgsSlug} });
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Favourites List Fetched successfully!",
            PackageListResource.collection(Packages),
            pkgsSlug
        ));
    } catch(err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ))
    }
})
/**
 * Add New Favourite 
*/
exports.addFavourite = asyncHandler(async(req, res) => {
    try {
        const {package_slug} = req.body;
        if(!package_slug) {
            return res.status(400).json(
                errorRes(
                    400,
                    "Please provide correct package details"
                )
            );
        }
        const isFav = await Favourite.findOne({package_slug: package_slug, customer_id: req.customer._id}).countDocuments();
        if(isFav == 0) {
            const favPackage = await Favourite.create({
                customer_id: req.customer._id,
                package_slug: package_slug
            });
        }
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Package marked as favourite",
        ))
    } catch(err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ))
    }
})
/**
 * Remove Favourite
*/
exports.removeFavourite = asyncHandler(async(req, res) => {
    try {
        const {package_slug} = req.body;
        if(!package_slug) {
            return res.status(400).json(
                errorRes(
                    400,
                    "Please provide correct package details"
                )
            );
        }
        const deleteFavourite = await Favourite.deleteOne({customer_id: req.customer._id, package_slug: package_slug});
        return res.status(200).json(successRes(
            200,
            "SUCCESS",
            "Favourite item removed from list",
        ))
    } catch(err) {
        return res.status(500).json(errorRes(
            500,
            "SERVER ERROR",
            err
        ))
    }
})