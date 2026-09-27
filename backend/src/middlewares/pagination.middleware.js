/**
 * Dynamic pagination, filtering, searching, sorting, and field selection
 * middleware factory for Mongoose models.
 *
 * @param {import('mongoose').Model} model - The Mongoose model to query.
 * @param {string} successMessage - Custom success message for response metadata.
 * @param {string[]} searchableFields - Fields to search when ?search= is used.
 * @return {Function} Express middleware function.
 */

// Helper to escape special regular expression characters to prevent ReDoS attacks
const escapeRegex = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const paginate = ({
  model,
  successMessage = 'Data retrieved successfully',
  searchableFields = ['name', 'email', 'phone', 'username', 'address']
}) => {
  return async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      // Enforce a maximum cap (e.g., 100) to prevent Out-Of-Memory (OOM) crashes
      const maxLimit = 100;
      const rawLimit = parseInt(req.query.limit, 10) || 10;
      const limit = Math.min(maxLimit, Math.max(1, rawLimit));

      const reservedKeys = ['page', 'limit', 'sort', 'search'];
      const queryObj = { ...req.query };

      reservedKeys.forEach(key => delete queryObj[key]);

      const filterConditions = { ...queryObj };

      if (req.query.search && searchableFields.length > 0) {
        const sanitizedSearch = escapeRegex(req.query.search.trim());
        const searchConditions = searchableFields.map(field => ({
          [field]: {
            $regex: sanitizedSearch,
            $options: 'i'
          }
        }));

        if (Object.keys(filterConditions).length > 0) {
          filterConditions.$and = [{ $or: searchConditions }];
        } else {
          filterConditions.$or = searchConditions;
        }
      }

      let query = model.find(filterConditions);

      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt'); // Default sort order
      }

      const [results, totalDocs] = await Promise.all([
        query.limit(limit).lean(),
        model.countDocuments(filterConditions)
      ]);

      const totalPages = Math.ceil(totalDocs / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.paginatedResults = {
        success: true,
        data: results,
        message: successMessage,
        pagination: {
          total_records_volume: totalDocs,
          total_pages: totalPages,
          current_page: page,
          limit,
          has_next_page: hasNextPage,
          has_previous_page: hasPrevPage,
          next_page: hasNextPage ? page + 1 : null,
          prev_page: hasPrevPage ? page - 1 : null
        }
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = paginate;
