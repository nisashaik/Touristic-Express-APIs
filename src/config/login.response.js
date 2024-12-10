const { currentDateTime, futureDateTime } = require("../helpers/date.helper");

exports.loginResponse = async (res, user, data, message) => {
    const accessToken = user.getJwtWebToken();
    await user.updateJwtRefreshTokenToDb();
    const refreshToken = user.refreshToken;
    const options = {
        expires: futureDateTime(process.env.JWT_TOKEN_COOKIE_EXPIRES),
        httpOnly: true,
        secure: true
    }
    res.status(200)
        .cookie('AccessToken', accessToken, options)
        .cookie('RefreshToken', refreshToken, options).json({
        res_status: 200,
        time: currentDateTime(),
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_expires: futureDateTime(process.env.JWT_ACCESS_TOKEN_EXPIRES),
        refresh_token_expires: futureDateTime(process.env.JWT_REFRESH_TOKEN_EXPIRES),
        result: {
            title: "SUCCESS",
            message: message,
            ...(data ? {data: data} : null)
        }
    });
}