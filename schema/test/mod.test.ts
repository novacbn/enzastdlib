import {
    assertEquals,
    assertInstanceOf,
    assertThrows,
} from '../../vendor/@deno-std-testing.ts';

import { ValidationError } from '../../errors/mod.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import { makeValidator } from '../mod.ts';

import type { PersonType } from './person.schema.ts';
import { SCHEMA_PERSON } from './person.schema.ts';

/** EXPORTED FUNCTIONALITY */

Deno.test(function instanceOfFailure() {
    const validator = makeValidator<PersonType>(SCHEMA_PERSON);

    const is_valid = validator.instanceOf({
        'firstName': 'John',
        'lastName': 'Doe',
        'age': '21',
    });

    assertTypeOf(is_valid, 'boolean');
    assertEquals(is_valid, false);
});

Deno.test(function instanceOfSuccess() {
    const validator = makeValidator<PersonType>(SCHEMA_PERSON);

    const is_valid = validator.instanceOf({
        'firstName': 'John',
        'lastName': 'Doe',
        'age': 21,
    });

    assertTypeOf(is_valid, 'boolean');
    assertEquals(is_valid, true);
});

Deno.test(function testFailure() {
    const validator = makeValidator<PersonType>(SCHEMA_PERSON);

    const errors = validator.test({
        'firstName': 'John',
        'lastName': 'Doe',
        'age': '21',
    });

    assertInstanceOf(errors, Array);

    assertEquals(errors, [
        {
            message: 'Property "age" does not match schema.',
            property: '#',
        },

        {
            message: 'Instance type "string" is invalid. Expected "integer".',
            property: '#/age',
        },

        {
            message:
                'Property "age" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/age',
        },
    ]);
});

Deno.test(function testSuccess() {
    const validator = makeValidator<PersonType>(SCHEMA_PERSON);

    const errors = validator.test({
        'firstName': 'John',
        'lastName': 'Doe',
        'age': 21,
    });

    assertEquals(errors, undefined);
});

Deno.test(function validateFailure() {
    const validator = makeValidator<PersonType>(SCHEMA_PERSON);

    assertThrows(
        () => {
            validator.validate({
                'firstName': 'John',
                'lastName': 'Doe',
                'age': '21',
            });
        },
        ValidationError,
        'bad argument #0 to \'Validator.validate\' (JSON Schema failed to validate):\n\n#: Property "age" does not match schema.\n#/age: Instance type "string" is invalid. Expected "integer".',
    );
});

Deno.test(function validateSuccess() {
    const validator = makeValidator<PersonType>(SCHEMA_PERSON);

    const is_valid = validator.validate({
        'firstName': 'John',
        'lastName': 'Doe',
        'age': 21,
    });

    assertTypeOf(is_valid, 'boolean');
    assertEquals(is_valid, true);
});
