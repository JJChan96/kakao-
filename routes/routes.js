const axios = require('axios')
const express = require('express')
const router = express.Router()
const qs = require('querystring')
const {client_id,client_secret,redirect_uri,host} = require('../config/config.js')


router.get('/',(req,res)=>{
    res.render('index')
})

router.get('/kakao/login',(req,res)=>{
    redirectURI = host + `/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
    // /oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code
    res.redirect(redirectURI)
})

router.get('/oauth/kakao', async (req,res)=>{
    const {query:{ code }} = req
    const token_url = host+'/oauth/token'
    
    try {
        const body = qs.stringify({
            grant_type:'authorization_code',
            client_id,
            redirect_uri,
            code,
            client_secret,
        })

        const headers = {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        const response = await axios.post(token_url,body,headers)
        console.log(response.data.access_token)
        
        const {access_token:ACCESS_TOKEN} = response.data
        const url = 'https://kapi.kakao.com/v2/user/me'
        const userinfo = await axios.get(url,{
            headers:{
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })

        console.log(userinfo.data.kakao_account.profile.nickname)
        console.log(userinfo.data.kakao_account.profile.profile_image_url)
        
        res.render('profile',{
            kakao:userinfo.data.kakao_account.profile
        })
    } catch (e) {
        console.log(e)
        res.json(e)
    }
})

module.exports = router
