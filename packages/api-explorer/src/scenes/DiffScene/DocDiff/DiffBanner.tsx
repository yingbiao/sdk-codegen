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
import type { FC } from 'react'
import React from 'react'
import { Grid, Flex, FlexItem, Code, Heading } from '@looker/components'
import type { DiffRow, IMethod } from '@looker/sdk-codegen'
import { DiffLegend } from './DiffLegend'

interface DiffBannerProps {
  item: DiffRow
  method: IMethod
}

export const DiffBanner: FC<DiffBannerProps> = ({ item, method }) => (
  <Grid justifyContent="space-between" columns={4}>
    <FlexItem>
      <Code>{item.name}</Code>
    </FlexItem>
    <FlexItem>
      <Heading as="h4" truncate>
        {item.id}
      </Heading>
    </FlexItem>
    <FlexItem>
      <Heading as="h4" truncate>
        {method?.summary}
      </Heading>
    </FlexItem>
    <Flex width="100%" justifyContent="flex-end">
      <DiffLegend count={item.diffCount} />
    </Flex>
  </Grid>
)
