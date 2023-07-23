import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  constructor(private http: HttpClient) {}

  private _tagsHistory: string[] = [];
  private apiKey: string = 'ElinSuQLNaqKdgYL6DnpC9yzGSsdfsJ0';
  private gifsUrl: string = 'https://api.giphy.com/v1/gifs';

  public gifList: Gif[] = [];

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  organizeHistory(tag: string): void {
    tag = tag.toLowerCase().trim();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0, 10);

    this.saveGifsInLocalStorage();
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', 10);

    this.http
      .get<SearchResponse>(`${this.gifsUrl}/search`, { params: params })
      .pipe()
      .subscribe((tags: SearchResponse) => {
        this.gifList = tags.data;
        console.log('list gifs: ', this.gifList);
      });
  }

  private saveGifsInLocalStorage(): void {
      localStorage.setItem('gifs', JSON.stringify(this._tagsHistory));
  }

   getGifsFromLocalStorage(): void {
    const temporal = localStorage.getItem('gifs');

    this._tagsHistory = temporal ? JSON.parse(temporal) : [];

    if (this._tagsHistory.length > 0) {
      this.searchTag(this._tagsHistory[0]);
    }
  }
}
