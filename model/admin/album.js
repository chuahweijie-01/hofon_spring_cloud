const connectionPool = require('../../conf/db');

exports.album_display_list = (company_id, pageInfo) => {
    var pageSize = 10;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;

    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                COUNT(*) AS total_image
            FROM
                companydb.image AS image
            JOIN
                companydb.company AS company
                USING (company_id)
            WHERE
                company.company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_image;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`
            SELECT
                image.image_id,
                image.image_path,
                DATE_FORMAT(image.created_date, '%d-%c-%Y') AS created_date
            FROM
                companydb.image AS image
            JOIN
                companydb.company AS company
                USING (company_id)
            WHERE
                company.company_id = ?
            ORDER BY
                image.image_id
            LIMIT ${limit}`, [company_id])
        })
        .then(([rows, field]) => {
            result = {
                total_image: numberOfRows,
                rows: rows,
                pagination: {
                    current: page,
                    numberPerPage: numberPerPage,
                    has_previous: page > 1,
                    previous: page - 1,
                    has_next: page < numberOfPages,
                    next: page + 1,
                    last_page: Math.ceil(numberOfRows / pageSize)
                }
            }
            return (result);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.album_category = (company_id, category_id, pageInfo) => {
    var pageSize = 10;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;

    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                COUNT(*) AS total_image
            FROM
                productdb.category AS category
            LEFT JOIN
                productdb.image AS image
                USING (category_id)
            JOIN
                companydb.company_category AS company_category
                USING (category_id)
            JOIN
                companydb.company AS company
                USING (company_id)
            WHERE
                company.company_id = ?
                AND category.category_id = ?`, [company_id, category_id])
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_image;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`
            SELECT
                category.category_id,
                category.category_name,
                image.image_id,
                image.image_path
            FROM
                productdb.category AS category
            LEFT JOIN
                productdb.image AS image
                USING (category_id)
            JOIN
                companydb.company_category AS company_category 
                USING (category_id)
            JOIN
                companydb.company AS company
                USING (company_id)
            WHERE
                company.company_id = ?
                AND category.category_id = ?
            LIMIT ${limit}`, [company_id, category_id])
        })
        .then(([rows, field]) => {
            result = {
                rows: rows,
                pagination: {
                    current: page,
                    numberPerPage: numberPerPage,
                    has_previous: page > 1,
                    previous: page - 1,
                    has_next: page < numberOfPages,
                    next: page + 1,
                    last_page: Math.ceil(numberOfRows / pageSize)
                }
            }
            return (result);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}

exports.album_add = (image_path, company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                COUNT(*) AS total_image
            FROM
                companydb.image AS image
            JOIN
                companydb.company AS company
                USING (company_id)
            WHERE
                company.company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            if (rows[0].total_image >= 100) throw new Error(`已超出可添加圖片的上限`);
            else return connection.query(`
            INSERT INTO
                companydb.image
                (company_id, image_path)
            VALUES ? `, [image_path])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`已新增上載圖片`);
            else throw new Error(`圖片新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.album_deleteProductImage = (image_id, company_id) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                image.image_path
            FROM
                companydb.image AS image
            JOIN
                companydb.company AS company
                USING (company_id)
            WHERE
                image.image_id = ?
                AND company.company_id = ?`, [image_id, company_id])
        })
        .then(([rows, field]) => {
            image_path = rows[0].image_path;
            return connection.query(`
            DELETE FROM
                companydb.image
            WHERE
                image_id = ?`, [image_id])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (image_path);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}