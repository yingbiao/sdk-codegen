/*

 MIT License

 Copyright (c) 2021 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import type * as OAS from 'openapi3-ts'
import { TestConfig } from './testUtils'
import { DartGen } from './dart.gen'
import type { IMappedType, IParameter, IProperty, IType, ApiModel } from '.'
import { EnumType } from '.'

const config = TestConfig()
const apiTestModel = config.apiTestModel

describe('Dart generator', () => {
  let gen: DartGen
  beforeEach(() => {
    gen = new DartGen(apiTestModel)
  })

  it('defaultApi', () => {
    gen.apiVersion = '4.0'
    expect(gen.isDefaultApi()).toEqual(true)
    gen.apiVersion = '3.1'
    expect(gen.isDefaultApi()).toEqual(false)
  })

  it('supportsMultiApi', () => {
    expect(gen.supportsMultiApi()).toEqual(false)
  })

  it('sdkFileName', () => {
    expect(gen.sdkFileName('methods')).toEqual(
      './dart/looker_sdk/lib/src/sdk/methods.dart'
    )
  })

  it('declareProperty', () => {
    let prop = gen.declareProperty('', {
      type: { name: 'String' },
      name: 'my_prop',
    } as IProperty)
    expect(prop).toEqual(
      `
 String _myProp;
 bool _myPropSet = false;
`
    )
    prop = gen.declareProperty('', {
      type: { name: 'String' },
      name: 'default',
    } as IProperty)
    expect(prop).toEqual(
      `
 String _defaultValue;
 bool _defaultValueSet = false;
`
    )
  })

  it('declarePropertyGetSet', () => {
    let prop = gen.declarePropertyGetSet('', {
      type: { name: 'String' },
      name: 'my_prop',
      description: '',
    } as IProperty)
    expect(prop).toEqual(
      `
       String get myProp {
         if (!_myPropSet && _apiMapResponse.containsKey('my_prop')) {
           _myProp = _apiMapResponse['my_prop']?.toString();
           _myPropSet = true;
         }
         return _myProp;
       }

       set myProp(String v) {
         _myProp = v;
         _myPropSet = true;
       }
`
    )
    prop = gen.declarePropertyGetSet('', {
      type: { name: 'String' },
      name: 'default',
      description: '',
    } as IProperty)
    expect(prop).toEqual(
      `
       String get defaultValue {
         if (!_defaultValueSet && _apiMapResponse.containsKey('default')) {
           _defaultValue = _apiMapResponse['default']?.toString();
           _defaultValueSet = true;
         }
         return _defaultValue;
       }

       set defaultValue(String v) {
         _defaultValue = v;
         _defaultValueSet = true;
       }
`
    )
  })

  it('methodsPrologue', () => {
    gen.apiVersion = '4.0'
    const prologue = gen.methodsPrologue('')
    expect(prologue).toEqual(`
// NOTE: Do not edit this file generated by Looker SDK Codegen for API 4.0
import '../looker_sdk.dart';

class LookerSDK extends APIMethods {
  LookerSDK(AuthSession authSession) : super(authSession);
`)
  })

  it('methodsEpilogue', () => {
    gen.apiVersion = '4.0'
    const s = gen.methodsEpilogue('')
    expect(s).toEqual('}')
  })

  it('modelsPrologue', () => {
    gen.apiVersion = '4.0'
    const prologue = gen.modelsPrologue('')
    expect(prologue).toEqual(`
// NOTE: Do not edit this file generated by Looker SDK Codegen for API 4.0
`)
  })

  it('modelsEpilogue', () => {
    gen.apiVersion = '4.0'
    const s = gen.modelsEpilogue('')
    expect(s).toEqual('')
  })

  it('commentHeader', () => {
    gen.apiVersion = '4.0'
    let s = gen.commentHeader('', undefined)
    expect(s).toEqual('')
    s = gen.commentHeader('', 'this is a comment', ' ')
    expect(s).toEqual(`/*

 this is a comment

 */
`)
    gen.apiVersion = '4.0'
    s = gen.commentHeader('', 'this is a comment')
    expect(s).toEqual(`/// this is a comment
`)
  })

  it('beginRegion', () => {
    gen.apiVersion = '4.0'
    const s = gen.beginRegion('', 'MyMethod')
    expect(s).toEqual('// #region MyMethod')
  })

  it('endRegion', () => {
    gen.apiVersion = '4.0'
    const s = gen.endRegion('', 'MyMethod')
    expect(s).toEqual('// #endregion MyMethod')
  })

  it('enumMapper', () => {
    gen.apiVersion = '4.0'
    const s = gen.enumMapper({
      name: 'MyEnum',
      values: ['value1', 'value2'],
    } as EnumType)
    expect(s).toEqual(`class MyEnumMapper {
       static String toStringValue(MyEnum e) {
         switch(e) {
case MyEnum.value1:
       return 'value1';
case MyEnum.value2:
       return 'value2';

           default:
             return null;
         }
       }

       static MyEnum fromStringValue(String s) {

     if (s == 'value1') {
       return MyEnum.value1;
     }
     if (s == 'value2') {
       return MyEnum.value2;
     }
         return null;
       }
     }`)
  })

  it('declareEnumValue', () => {
    const s = gen.declareEnumValue('', 'value_xyz')
    expect(s).toEqual('valueXyz')
  })

  it('defaultConstructor', () => {
    let s = gen.defaultConstructor(
      new EnumType(
        { name: 'MyEnum' } as IType,
        { 'x-looker-values': [] } as OAS.SchemaObject,
        { getEnumList: () => ({}), types: {} } as ApiModel
      )
    )
    s = gen.defaultConstructor({ name: 'MyType' } as IType)
    expect(s).toEqual(`
MyType() {
  _apiMapResponse = {};
}
`)
  })

  it('getApiRawResponse', () => {
    const s = gen.getApiRawResponse({ name: 'MyType' } as IType)
    expect(s).toEqual(`
Object get apiRawResponse {
  return _apiRawResponse;
}
`)
  })

  it('getApiRawValue', () => {
    const s = gen.getApiRawValue({ name: 'MyType' } as IType)
    expect(s).toEqual(`
Object getApiRawValue(String valueName) {
  return _apiMapResponse == null ? null : _apiMapResponse[valueName];
}
`)
  })

  it('getContentType', () => {
    const s = gen.getContentType({
      name: 'MyType',
    } as IType)
    expect(s).toEqual(`
String get apiResponseContentType {
  return _apiResponseContentType;
}
`)
  })

  it('toJson', () => {
    const s = gen.toJson({
      name: 'MyType',
      properties: {
        my_prop: { name: 'my_prop', type: { name: 'String' } } as IProperty,
      },
    } as unknown as IType)
    expect(s).toEqual(`
Map toJson() {
  var json = {};
if (_myPropSet || _apiMapResponse.containsKey('my_prop')) {
json['my_prop'] = myProp;
}
  return json;
}
`)
  })

  it('fromResponse', () => {
    const s = gen.fromResponse({
      name: 'MyType',
      properties: {
        my_prop: { name: 'my_prop', type: { name: 'String' } } as IProperty,
      },
    } as unknown as IType)
    expect(s).toEqual(`
MyType.fromResponse(Object apiRawResponse, String apiResponseContentType) {
  _apiRawResponse = apiRawResponse;
  _apiMapResponse = {};
  if (apiRawResponse is Map) {
    _apiMapResponse = apiRawResponse;
  }
  _apiResponseContentType = apiResponseContentType ?? '';
}
`)
  })

  it('propertyFromJson', () => {
    const s = gen.propertyFromJson(
      { name: 'my_prop', type: { name: 'String' } } as IProperty,
      '_apiMapResponse'
    )
    expect(s).toEqual("_myProp = _apiMapResponse['my_prop']?.toString()")
  })

  it('summary', () => {
    const s = gen.summary('', 'ignored')
    expect(s).toEqual('')
  })

  it('typeSignature', () => {
    const s = gen.typeSignature('', {
      name: 'MyType',
      description: 'This is my type',
    } as IType)
    expect(s).toEqual(`/// This is my type
class MyType  {
`)
  })

  it('sdkClassName', () => {
    const s = gen.sdkClassName()
    expect(s).toEqual('LookerSDK')
  })

  it.each([
    [
      {
        refCount: 0,
        name: 'string',
      },
      'String',
      {
        refCount: 0,
        name: 'boolean',
      },
      {
        refCount: 0,
        name: 'date',
      },
      'DateTime',
    ],
  ])('typeMap', (type, expected) => {
    const s = gen.typeMap(type as unknown as IType)
    expect(s.name).toEqual(expected)
  })

  it('paramComment', () => {
    const s = gen.paramComment(
      {
        name: 'myParam',
        description: 'My parameters desciption',
      } as IParameter,
      { name: 'string' } as IMappedType
    )
    expect(s).toEqual('@param {string} myParam My parameters desciption')
  })

  // it('declareParameter', () => {})

  // it('methodHeaderDeclaration', () => {})

  // it('encodePathParams', () => {})

  // it('responseHandler', () => {})

  // it('httpCall', () => {})
})
