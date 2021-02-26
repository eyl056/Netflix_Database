exports.check = async function (req, res) {
    console.log("GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다.");
    return res.json({
        message: "GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다."
    });
}