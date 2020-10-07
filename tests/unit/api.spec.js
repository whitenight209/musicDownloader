import * as assert from 'assert';
import { searchYoutube } from '@/util/api';

describe('youtube api test', () => {
  it('youtube api test', done => {
    const songName = '아이유';
    const result = searchYoutube('AIzaSyB73lB6nwGd55DT4LjTikhkIfMluml7fKc', songName);
    console.log(result);
    assert.strictEqual(result.length, 50);
    done();
  });
});
