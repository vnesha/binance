export async function GET(request: Request) {
    console.log("Received request:", request);
    
    const url = new URL(request.url);
    console.log("URL:", url);
    
    const { searchParams } = url;
    const symbol = searchParams.get('symbol');
    const quantity = searchParams.get('quantity');

    console.log("Symbol:", symbol);
    console.log("Quantity:", quantity);

    const redirectUrl = `/api/order?symbol=${symbol}&quantity=${quantity}`;
    console.log("Redirect URL:", redirectUrl);
    
    return Response.redirect(redirectUrl, 302);
}
