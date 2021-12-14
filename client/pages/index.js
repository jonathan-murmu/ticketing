import buildClient from "../api/build-client";

const LandingPage = ({currentuser}) => {
    console.log('Landing Page currentuser', currentuser)
    return currentuser? <h1>You r signed in</h1>: <h1>you r not signed in</h1>

}

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context)
    const { data } = await client.get('/api/users/currentuser');
    return data;
    
};

export default LandingPage;