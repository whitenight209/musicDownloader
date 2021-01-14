import * as assert from 'assert';
import { searchYoutube } from '@/util/api';

describe('youtube api test', () => {
  it('youtube api test', done => {
    const songName = '아이유';
    const result = searchYoutube('AIzaSyC_XsXKWRcaeh435Akc1h04DSQSjGdNqGc', songName);
    console.log(result);
    assert.strictEqual(result.length, 50);
    done();
  });
});
