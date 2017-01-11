/**
 * Markdown YAML metadata parser
 * @module markdown-yaml-metadata-parser
 */

import yaml from 'js-yaml';

const METADATA_START = /^---\n/;
const METADATA_END = /\n---\n/;

/**
 * Split a markdown source string into a two-property object containing metadata and content.
 *
 * @private
 * @param {String} src The string to split.
 * @returns {Object} Two-property object containing 'metadata' and 'content'.
 */
const splitSource = (src) => {
  const splitResult = {
    metadata: '',
    content: src,
  };

  if (src.match(METADATA_START)) {
    const sections = src.replace(METADATA_START, '').split(METADATA_END);

    if (sections.length > 1) {
      if (sections[0].trim()) {
        splitResult.metadata = sections[0].trim();
      }

      splitResult.content = sections[1];
    }
  }

  return splitResult;
};

/**
 * Parse a markdown document looking for metadata in YAML format.
 * In order to be parsed, metadata must be placed at the beginning of the document between two triple dashes.
 * Example:
 * ---
 * title: Lorem ipsum
 * author: Marcus Antonius
 * keywords: latin, ipsum
 * ---
 *
 * @param {String} src The string to be parsed.
 * @throws {TypeError} Argument src must be a String.
 * @throws {YAMLException} On YAML parsing error.
 * @returns {Object} Two-property object: 'metadata': object of parsed metadata, 'content': document source without metadata
 */
const parse = (src) => {
  if (!(typeof src === 'string' || src instanceof String)) {
    throw new TypeError('Source parameter (src) must be a string.');
  }

  const splitResult = splitSource(src);

  if (splitResult.metadata) {
    splitResult.metadata = yaml.safeLoad(splitResult.metadata);
  }

  return splitResult;
};

module.exports = parse;
