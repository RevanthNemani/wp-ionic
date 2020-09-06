import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getPosts(page = 1): Observable<any> {
    const options = {
      observe: 'response' as 'body',
      params: {
        per_page: '5',
        page: '' + page,
      },
    };

    return this.http
      .get<any[]>(`${environment.apiUrl}posts?_embed`, options)
      .pipe(
        map((res) => {
          const data = res['body'];

          data.map((post) => {
            if (post['_embedded']['wp:featuresmedia']) {
              post.media_url =
                post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes[
                  'medium'
                ].source_url;
            }
          });

          return {
            posts: data,
            pages: res['headers'].get('x-wp-totalpages'),
            totalPosts: res['headers'].get('x-wp-total'),
          };
        })
      );
  }
}
