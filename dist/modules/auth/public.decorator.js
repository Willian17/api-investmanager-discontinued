"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
function Public() {
    return (0, common_1.applyDecorators)((0, common_2.SetMetadata)(exports.IS_PUBLIC_KEY, true));
}
exports.Public = Public;
//# sourceMappingURL=public.decorator.js.map