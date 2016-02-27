<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<head>
				<title>
					<xsl:value-of select="parent/caption"/>
				</title>
			</head>
			<body title="{parent/main/caption}" style="background-color: #b8a49b; font-family: georgia; margin: 50px 0 0 160px">
				<h3 style="color: #986a46 ">
					<xsl:value-of select="parent/main/caption"/>
				</h3>
				<ul>
					<xsl:for-each select="parent/main/sibling">
					<li style="color: #5a4c3f; margin: 5px">
						<xsl:value-of select="@title"/>
						<xsl:for-each select="child">
							<ul>
								<li style="color: #a27264; list-style: square; margin: 5px">
								<xsl:value-of select="child::text()"/>
									<xsl:for-each select="branch">
										<ul>
											<li style="margin: 5px; list-style: circle; color: #33282c">
												<xsl:value-of select="child::text()"/>
												 <xsl:for-each select="span">
													<span style="color: #585340">
														<xsl:value-of select="child::text()" />
													</span>
												</xsl:for-each> 
											</li>
										</ul>
									</xsl:for-each>
								</li>
							</ul>
						</xsl:for-each>
					</li>
					</xsl:for-each>
				</ul>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>