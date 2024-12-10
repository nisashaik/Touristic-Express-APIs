class PackageListResource {
    static single(packg) {
        return {
            _id: packg.id,
            package_title: packg.package_title,
            package_slug: packg.package_slug,
            package_desc: packg.package_desc,
            number_of_days: packg.number_of_days,
            number_of_nights: packg.number_of_nights,
            price_deluxe: packg.price_deluxe,
            price_super_deluxe: packg.price_super_deluxe,
            pax_count: packg.pax_count,
            package_inclusions: packg.package_inclusions,
            package_itinerary: packg.package_itinerary,
            featured_image: packg.featured_image,
            gallery_images: packg.gallery_images,
            category_id: packg.category_id._id,
            category_name: packg.category_id.name,
            from_date: packg.from_date,
            to_date: packg.from_date,
            createdAt: packg.createdAt
        }
    }
    static collection(packages){
        return packages.map(packg => this.single(packg));
    }
}

module.exports = PackageListResource