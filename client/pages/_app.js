import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentuser }) => {
    console.log('currentuser app co', currentuser)
    return <div>
        <Header currentUser={currentuser}> </Header>
        <Component {...pageProps} />
    </div>
};

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    console.log('pageProps', pageProps)
    console.log('data', data)

    return {
        pageProps,
        ...data
    };
}

export default AppComponent;
