import assert from 'assert';
import {
  limit,
  arrayMove,
} from './src/utils';


describe('tests', function(){
  describe('test limit util', function(){
    it('should return value in provided range', function(){
      assert.equal(limit(10, 20, 21), 20);
      assert.equal(limit(10, 20, 9), 10);
    });
  });

  describe('test limit util', function(){
    it('should return array in swapped positions', function(){
      const arr = [1, 2, 3, 4, 5, {foo: 6}, 7];
      assert.deepEqual( arrayMove(arr, 5, 2), [1, 2, {foo: 6}, 4, 5, 3, 7]);
      assert.deepEqual( arrayMove(arr, 3, 8), [1, 2, 3, undefined, 5, {foo: 6}, 7, undefined, 4]);
    });
  });
});