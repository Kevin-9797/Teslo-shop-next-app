import { jwt } from "@/utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const previousPage = req.nextUrl.pathname;

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const validRoles = ['admin', 'super-user', 'SEO'];
  if( !session ){
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.search = `p=${ previousPage }`    
      if( previousPage.includes('/api')){
        return new Response( JSON.stringify({ message: 'Not authorize' }),{
          status: 401,
          headers:{
            'Content-Type':'application/json'
          }
        });
      }
      return NextResponse.redirect( url );
  }

  if( previousPage.includes('/api/admin/') && !validRoles.includes(session.user?.role!)){
    return new Response( JSON.stringify({ message: 'Not authorize' }),{
      status: 401,
      headers:{
        'Content-Type':'application/json'
      }
      });
  }
  if( previousPage.includes('/admin') && !validRoles.includes( session.user?.role! ) ){
 
    return NextResponse.redirect(new URL('/', req.url));
  };
  return NextResponse.next();

}

export const config = {
  matcher: ['/checkout/:path*','/orders/:path*','/api/orders/:path*','/admin/:path*','/api/admin/:path*'],
};

//middleware sin next auth

// const previousPage = req.nextUrl.pathname;

// if( previousPage.startsWith('/checkout') ){
//     const  token  = req.cookies.get('token') || '';
//     if(!token ) {
//         console.log(req.url + 'Este es el middlewrae')

//         return NextResponse.redirect(
//             new URL(`/auth/login?p=${ previousPage }`, req.url)
//         )
//     }

//     try {
//         await jwtVerify(token.value  || "",new TextEncoder().encode(process.env.JWT_SECRET_SEED) || '');
//         return NextResponse.next();
//     } catch (error) {
//         console.error(`JWT Invalid or not signed in`, { error });
//         const { protocol, host, pathname } = req.nextUrl;
//         return NextResponse.redirect(
//           `${protocol}//${host}/auth/login?previousPath=${pathname}`
//         );
//     }
